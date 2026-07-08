import { createStore } from '../store/create-store'
import type { SliderChangeMeta, SliderController, SliderOptions, SliderSnapshot } from './types'
import { getClosestValueIndex, getNextSortedValues, hasMinStepsBetweenValues, snapValueToStep } from './utils'

function normalizeValue(values: readonly number[] | undefined, min: number, max: number, step: number) {
  const source = values && values.length > 0 ? values : [min]
  return source.map((value) => snapValueToStep(value, min, max, step)).sort((a, b) => a - b)
}

function createSliderSnapshot(options: SliderOptions, fallbackValues?: readonly number[]): SliderSnapshot {
  const min = options.min ?? 0
  const max = options.max ?? 100
  const step = options.step ?? 1

  return {
    values: normalizeValue(options.value ?? fallbackValues ?? options.defaultValue, min, max, step),
    disabled: options.disabled === true,
    min,
    max,
    step,
    minStepsBetweenThumbs: options.minStepsBetweenThumbs ?? 0,
    activeIndex: 0,
    orientation: options.orientation ?? 'horizontal',
  }
}

export function createSliderController(options: SliderOptions = {}): SliderController {
  const isControlled = () => options.value !== undefined
  const store = createStore(createSliderSnapshot(options))
  let controlledSnapshot = store.getSnapshot()
  let valuesBeforeSlideStart = store.getSnapshot().values
  let hasSyncedUncontrolledOptions = false

  const getCurrentSnapshot = () => {
    if (!isControlled()) {
      return store.getSnapshot()
    }

    const nextSnapshot = {
      ...createSliderSnapshot(options),
      activeIndex: controlledSnapshot.activeIndex,
    }
    if (
      controlledSnapshot.disabled === nextSnapshot.disabled &&
      controlledSnapshot.min === nextSnapshot.min &&
      controlledSnapshot.max === nextSnapshot.max &&
      controlledSnapshot.step === nextSnapshot.step &&
      controlledSnapshot.minStepsBetweenThumbs === nextSnapshot.minStepsBetweenThumbs &&
      controlledSnapshot.activeIndex === nextSnapshot.activeIndex &&
      controlledSnapshot.orientation === nextSnapshot.orientation &&
      controlledSnapshot.values.length === nextSnapshot.values.length &&
      controlledSnapshot.values.every((value, index) => value === nextSnapshot.values[index])
    ) {
      return controlledSnapshot
    }
    controlledSnapshot = nextSnapshot
    return controlledSnapshot
  }

  const syncUncontrolledSnapshot = () => {
    const snapshot = store.getSnapshot()
    const nextSnapshot = {
      ...createSliderSnapshot(options, hasSyncedUncontrolledOptions ? snapshot.values : undefined),
      activeIndex: Math.min(snapshot.values.length - 1, snapshot.activeIndex),
    }
    hasSyncedUncontrolledOptions = true
    store.setSnapshot(nextSnapshot)
  }

  function commitValues(values: number[], changedIndex: number, commit = false) {
    const previousSnapshot = getCurrentSnapshot()
    if (previousSnapshot.disabled) return undefined

    const meta: SliderChangeMeta = {
      previousValues: previousSnapshot.values,
      values,
      changedIndex,
    }

    if (!isControlled()) {
      store.setSnapshot({ ...previousSnapshot, values, activeIndex: changedIndex })
    } else {
      controlledSnapshot = { ...previousSnapshot, activeIndex: changedIndex }
    }

    options.onChange?.(values, meta)
    if (commit) options.onCommit?.(values, meta)
    return meta
  }

  function setValueAt(index: number, value: number, actionOptions: { commit?: boolean } = {}) {
    const snapshot = getCurrentSnapshot()
    const nextValue = snapValueToStep(value, snapshot.min, snapshot.max, snapshot.step)
    const nextValues = getNextSortedValues(snapshot.values, nextValue, index)
    if (!hasMinStepsBetweenValues(nextValues, snapshot.minStepsBetweenThumbs * snapshot.step)) {
      return undefined
    }
    const changedIndex = nextValues.indexOf(nextValue)
    if (snapshot.values.length === nextValues.length && snapshot.values.every((item, itemIndex) => item === nextValues[itemIndex])) {
      return undefined
    }
    return commitValues(nextValues, changedIndex, actionOptions.commit)
  }

  return {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    syncSnapshot: () => {
      if (!isControlled()) {
        syncUncontrolledSnapshot()
        return
      }
      store.setSnapshot(getCurrentSnapshot())
    },
    setActiveIndex: (index) => {
      const snapshot = getCurrentSnapshot()
      const nextIndex = Math.min(snapshot.values.length - 1, Math.max(0, index))
      if (!isControlled()) {
        store.setSnapshot({ ...snapshot, activeIndex: nextIndex })
      } else {
        controlledSnapshot = { ...snapshot, activeIndex: nextIndex }
      }
    },
    setValueAt,
    startSlide: (value) => {
      const snapshot = getCurrentSnapshot()
      valuesBeforeSlideStart = snapshot.values
      const closestIndex = getClosestValueIndex(snapshot.values, value)
      return setValueAt(closestIndex, value)
    },
    moveSlide: (value) => setValueAt(getCurrentSnapshot().activeIndex, value),
    endSlide: () => {
      const snapshot = getCurrentSnapshot()
      const changedIndex = snapshot.activeIndex
      if (valuesBeforeSlideStart[changedIndex] === snapshot.values[changedIndex]) {
        return undefined
      }
      const meta: SliderChangeMeta = {
        previousValues: valuesBeforeSlideStart,
        values: snapshot.values,
        changedIndex,
      }
      options.onCommit?.(snapshot.values, meta)
      return meta
    },
    stepThumb: (index, direction, multiplier = 1) => {
      const snapshot = getCurrentSnapshot()
      return setValueAt(index, snapshot.values[index]! + snapshot.step * direction * multiplier, { commit: true })
    },
  }
}
