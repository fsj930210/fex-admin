import { createStore } from '../store/create-store'
import type {
  TimePeriod,
  TimePickerController,
  TimePickerControllerOptions,
  TimePickerSnapshot,
  TimeValue,
} from './types'
import { EMPTY_TIME_VALUE, from12Hour, getTimePeriod, normalizeTimeValue, to12Hour } from './value'

export function createTimePickerController(
  options: TimePickerControllerOptions = {},
): TimePickerController {
  let controlled = options.value !== undefined
  let controlledValue = options.value ?? null
  let scrollRequestId = 0
  const store = createStore<TimePickerSnapshot>({
    value: controlled ? controlledValue : (options.defaultValue ?? null),
    scrollRequest: null,
  })

  function currentValue(): TimeValue | null {
    return controlled ? controlledValue : store.getSnapshot().value
  }

  function publish(value: TimeValue | null, scroll?: 'auto' | 'smooth') {
    store.updateSnapshot(snapshot => ({
      value,
      scrollRequest: scroll
        ? { id: ++scrollRequestId, behavior: scroll }
        : snapshot.scrollRequest,
    }))
  }

  function change(
    nextValue: TimeValue | null,
    reason: Parameters<TimePickerController['change']>[1],
    scroll?: 'auto' | 'smooth',
  ) {
    const previousValue = currentValue()
    const normalized = nextValue ? normalizeTimeValue(nextValue) : null
    if (!controlled) publish(normalized, scroll)
    else if (scroll) publish(previousValue, scroll)
    options.onChange?.(normalized, { reason, previousValue })
  }

  function baseValue(): TimeValue {
    return currentValue() ?? { ...EMPTY_TIME_VALUE }
  }

  return {
    getSnapshot: store.getSnapshot,
    subscribe: store.subscribe,
    setControlledValue(value) {
      controlled = true
      controlledValue = value
      publish(value)
    },
    change,
    selectHour(hour, use12Hours = false) {
      const current = baseValue()
      change(
        {
          ...current,
          hour: use12Hours ? from12Hour(hour, getTimePeriod(current.hour)) : hour,
        },
        'hour',
        'smooth',
      )
    },
    selectMinute(minute) {
      change({ ...baseValue(), minute }, 'minute', 'smooth')
    },
    selectSecond(second) {
      change({ ...baseValue(), second }, 'second', 'smooth')
    },
    selectPeriod(period: TimePeriod) {
      const current = baseValue()
      change(
        { ...current, hour: from12Hour(to12Hour(current.hour), period) },
        'period',
        'smooth',
      )
    },
    clear() {
      change(null, 'clear')
    },
    scrollToValue(behavior = 'smooth') {
      publish(currentValue(), behavior)
    },
  }
}
