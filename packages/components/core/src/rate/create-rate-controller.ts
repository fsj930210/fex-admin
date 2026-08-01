import { createStore } from '../store/create-store'
import type { RateChangeMeta, RateController, RateOptions, RateSnapshot } from './types'
import { normalizeRateCount, normalizeRateStep, normalizeRateValue, snapRateValue } from './utils'

function createRateSnapshot(
  options: RateOptions,
  fallbackValue?: number,
  transient?: Partial<RateSnapshot>,
): RateSnapshot {
  const count = normalizeRateCount(options.count)
  const step = normalizeRateStep(options.step)
  const value = normalizeRateValue(options.value ?? fallbackValue ?? options.defaultValue, count)
  const previewValue =
    transient?.previewValue === null || transient?.previewValue === undefined
      ? null
      : normalizeRateValue(transient.previewValue, count)

  return {
    value,
    previewValue,
    displayValue: previewValue ?? value,
    count,
    step,
    disabled: options.disabled === true,
    readOnly: options.readOnly === true,
    allowClear: options.allowClear !== false,
    direction: options.direction ?? 'ltr',
    interacting: transient?.interacting === true,
  }
}

function snapshotsEqual(left: RateSnapshot, right: RateSnapshot) {
  return (
    left.value === right.value &&
    left.previewValue === right.previewValue &&
    left.displayValue === right.displayValue &&
    left.count === right.count &&
    left.step === right.step &&
    left.disabled === right.disabled &&
    left.readOnly === right.readOnly &&
    left.allowClear === right.allowClear &&
    left.direction === right.direction &&
    left.interacting === right.interacting
  )
}

export function createRateController(options: RateOptions = {}): RateController {
  const isControlled = () => options.value !== undefined
  const store = createStore(createRateSnapshot(options))
  let derivedSnapshot = store.getSnapshot()
  let uncontrolledValue = derivedSnapshot.value
  let hasResolvedDefaultValue = options.defaultValue !== undefined
  let interactionStartValue = derivedSnapshot.value

  function getCurrentSnapshot() {
    const stored = store.getSnapshot()
    if (!isControlled() && !hasResolvedDefaultValue && options.defaultValue !== undefined) {
      uncontrolledValue = normalizeRateValue(
        options.defaultValue,
        normalizeRateCount(options.count),
      )
      hasResolvedDefaultValue = true
    }
    const next = createRateSnapshot(options, isControlled() ? undefined : uncontrolledValue, stored)
    if (snapshotsEqual(derivedSnapshot, next)) return derivedSnapshot
    derivedSnapshot = next
    return derivedSnapshot
  }

  function updateTransient(transient: Partial<RateSnapshot>) {
    const current = getCurrentSnapshot()
    store.setSnapshot(
      createRateSnapshot(options, isControlled() ? undefined : current.value, {
        previewValue:
          transient.previewValue === undefined ? current.previewValue : transient.previewValue,
        interacting:
          transient.interacting === undefined ? current.interacting : transient.interacting,
      }),
    )
  }

  function setValue(value: number, actionOptions: { commit?: boolean } = {}) {
    const snapshot = getCurrentSnapshot()
    if (snapshot.disabled || snapshot.readOnly) return undefined
    const nextValue = snapRateValue(value, snapshot.step, snapshot.count)
    if (nextValue === snapshot.value) return undefined

    const meta: RateChangeMeta = { previousValue: snapshot.value, value: nextValue }
    if (!isControlled()) {
      uncontrolledValue = nextValue
      store.setSnapshot(
        createRateSnapshot(options, nextValue, { previewValue: null, interacting: false }),
      )
    }
    options.onChange?.(nextValue, meta)
    if (actionOptions.commit) options.onCommit?.(nextValue, meta)
    return meta
  }

  return {
    getSnapshot: getCurrentSnapshot,
    subscribe: store.subscribe,
    syncSnapshot: () => store.setSnapshot(getCurrentSnapshot()),
    preview: (value) => {
      const snapshot = getCurrentSnapshot()
      if (snapshot.disabled || snapshot.readOnly || snapshot.interacting) return
      const nextValue = snapRateValue(value, snapshot.step, snapshot.count)
      if (snapshot.previewValue === nextValue) return
      updateTransient({ previewValue: nextValue })
      options.onPreviewChange?.(nextValue)
    },
    clearPreview: () => {
      const snapshot = getCurrentSnapshot()
      if (snapshot.interacting || snapshot.previewValue === null) return
      updateTransient({ previewValue: null })
      options.onPreviewChange?.(null)
    },
    startInteraction: (value) => {
      const snapshot = getCurrentSnapshot()
      if (snapshot.disabled || snapshot.readOnly) return
      interactionStartValue = snapshot.value
      updateTransient({
        previewValue: snapRateValue(value, snapshot.step, snapshot.count),
        interacting: true,
      })
      options.onPreviewChange?.(snapRateValue(value, snapshot.step, snapshot.count))
    },
    moveInteraction: (value) => {
      const snapshot = getCurrentSnapshot()
      if (!snapshot.interacting) return
      const nextValue = snapRateValue(value, snapshot.step, snapshot.count)
      if (snapshot.previewValue === nextValue) return
      updateTransient({ previewValue: nextValue })
      options.onPreviewChange?.(nextValue)
    },
    commitInteraction: () => {
      const snapshot = getCurrentSnapshot()
      if (!snapshot.interacting || snapshot.previewValue === null) return undefined
      const nextValue =
        snapshot.allowClear && snapshot.previewValue === interactionStartValue
          ? 0
          : snapshot.previewValue
      updateTransient({ previewValue: null, interacting: false })
      options.onPreviewChange?.(null)
      return setValue(nextValue, { commit: true })
    },
    cancelInteraction: () => {
      const snapshot = getCurrentSnapshot()
      updateTransient({ previewValue: null, interacting: false })
      if (snapshot.previewValue !== null) options.onPreviewChange?.(null)
    },
    setValue,
    stepValue: (direction, multiplier = 1) => {
      const snapshot = getCurrentSnapshot()
      return setValue(snapshot.value + snapshot.step * direction * multiplier, { commit: true })
    },
  }
}
