import { createStore } from '../store/create-store'
import type {
  StepInfo,
  StepRecord,
  StepsController,
  StepsControllerOptions,
  StepsSnapshot,
  StepValue,
} from './types'

export function createStepsController<TData = unknown>(
  initialOptions: StepsControllerOptions<TData> = {},
): StepsController<TData> {
  let options = initialOptions
  const steps = new Map<StepValue, StepRecord<TData>>()
  let order: readonly StepValue[] = []
  const store = createStore<StepsSnapshot>({
    current: options.current ?? options.defaultCurrent,
    revision: 0,
  })
  const isControlled = () => options.current !== undefined
  const snapshot = () => {
    const value = store.getSnapshot()
    return isControlled() && value.current !== options.current
      ? { ...value, current: options.current }
      : value
  }
  const ordered = () => {
    const orderedValues = new Set(order)
    return [...order.map((value) => steps.get(value)).filter((step): step is StepRecord<TData> => step !== undefined), ...[...steps.values()].filter((step) => !orderedValues.has(step.value))]
  }

  function info(value: StepValue, currentValue = snapshot().current): StepInfo<TData> | undefined {
    const step = steps.get(value)
    if (!step) return undefined
    const all = ordered()
    const position = all.findIndex((item) => item.value === value)
    const currentPosition = all.findIndex((item) => item.value === currentValue)
    const status =
      step.status ??
      (currentPosition < 0 || position > currentPosition
        ? 'wait'
        : position === currentPosition
          ? 'process'
          : 'finish')
    return {
      value: step.value,
      status,
      disabled: step.disabled === true,
      ...(step.data === undefined ? {} : { data: step.data }),
    }
  }

  function notifyRegistration() {
    const current = store.getSnapshot()
    store.setSnapshot({ ...current, revision: current.revision + 1 })
  }

  return {
    getSnapshot: snapshot,
    subscribe: store.subscribe,
    updateOptions(nextOptions) {
      options = nextOptions
      if (isControlled() && store.getSnapshot().current !== options.current) {
        store.setSnapshot({ ...store.getSnapshot(), current: options.current })
      } else if (!isControlled() && store.getSnapshot().current === undefined && options.defaultCurrent !== undefined) {
        store.setSnapshot({ ...store.getSnapshot(), current: options.defaultCurrent })
      }
    },
    registerStep(step) {
      const previous = steps.get(step.value)
      steps.set(step.value, step)
      if (
        !previous ||
        previous.disabled !== step.disabled ||
        previous.status !== step.status ||
        previous.data !== step.data
      ) notifyRegistration()
    },
    setOrder(values) {
      const nextOrder = values.filter((value) => steps.has(value))
      if (nextOrder.length === order.length && nextOrder.every((value, index) => value === order[index])) return
      order = nextOrder
      notifyRegistration()
    },
    unregisterStep(value) {
      if (steps.delete(value)) {
        order = order.filter((currentValue) => currentValue !== value)
        notifyRegistration()
      }
    },
    getStepInfo: info,
    getPosition(value) {
      return ordered().findIndex((step) => step.value === value)
    },
    select(value, trigger) {
      if (!options.navigation) return undefined
      const registered = steps.get(value)
      if (!registered || registered.disabled || snapshot().current === value) return undefined
      const previous = snapshot().current
      const previousInfo = previous === undefined ? null : (info(previous) ?? null)
      const currentInfo = info(value, value)
      if (!currentInfo) return undefined
      if (!isControlled()) store.setSnapshot({ ...store.getSnapshot(), current: value })
      options.onChange?.(value, { previous: previousInfo, current: currentInfo, trigger })
      return value
    },
    move(value, direction) {
      const available = ordered().filter((step) => !step.disabled)
      if (available.length === 0) return undefined
      const position = available.findIndex((step) => step.value === value)
      const last = available.length - 1
      const nextPosition =
        direction === 'first'
          ? 0
          : direction === 'last'
            ? last
            : direction === 'next'
              ? Math.min(position + 1, last)
              : Math.max(position - 1, 0)
      return available[nextPosition < 0 ? 0 : nextPosition]?.value
    },
  }
}
