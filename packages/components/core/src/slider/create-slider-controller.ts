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
  let derivedSnapshot = store.getSnapshot()
  let valuesBeforeSlideStart = store.getSnapshot().values

  const getCurrentSnapshot = () => {
    const storedSnapshot = store.getSnapshot()
    const nextBaseSnapshot = createSliderSnapshot(options, isControlled() ? undefined : storedSnapshot.values)
    const nextSnapshot = {
      ...nextBaseSnapshot,
      activeIndex: Math.min(nextBaseSnapshot.values.length - 1, storedSnapshot.activeIndex),
    }
    if (
      derivedSnapshot.disabled === nextSnapshot.disabled &&
      derivedSnapshot.min === nextSnapshot.min &&
      derivedSnapshot.max === nextSnapshot.max &&
      derivedSnapshot.step === nextSnapshot.step &&
      derivedSnapshot.minStepsBetweenThumbs === nextSnapshot.minStepsBetweenThumbs &&
      derivedSnapshot.activeIndex === nextSnapshot.activeIndex &&
      derivedSnapshot.orientation === nextSnapshot.orientation &&
      derivedSnapshot.values.length === nextSnapshot.values.length &&
      derivedSnapshot.values.every((value, index) => value === nextSnapshot.values[index])
    ) {
      return derivedSnapshot
    }
    derivedSnapshot = nextSnapshot
    return derivedSnapshot
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
      store.setSnapshot({ ...previousSnapshot, activeIndex: changedIndex })
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
    syncSnapshot: () => store.setSnapshot(getCurrentSnapshot()),
    setActiveIndex: (index) => {
      const snapshot = getCurrentSnapshot()
      const nextIndex = Math.min(snapshot.values.length - 1, Math.max(0, index))
      if (!isControlled()) {
        store.setSnapshot({ ...snapshot, activeIndex: nextIndex })
      } else {
        store.setSnapshot({ ...snapshot, activeIndex: nextIndex })
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
