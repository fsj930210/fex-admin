import type { TimePeriod, TimeValue } from './types'

export const EMPTY_TIME_VALUE: Readonly<TimeValue> = Object.freeze({
  hour: 0,
  minute: 0,
  second: 0,
})

export function normalizeTimeValue(value: TimeValue): TimeValue {
  return {
    hour: clampInteger(value.hour, 0, 23),
    minute: clampInteger(value.minute, 0, 59),
    second: clampInteger(value.second, 0, 59),
    ...(value.millisecond === undefined
      ? {}
      : { millisecond: clampInteger(value.millisecond, 0, 999) }),
  }
}

export function getTimePeriod(hour: number): TimePeriod {
  return hour >= 12 ? 'pm' : 'am'
}

export function to12Hour(hour: number): number {
  const normalized = ((hour % 24) + 24) % 24
  return normalized % 12 || 12
}

export function from12Hour(hour: number, period: TimePeriod): number {
  const normalized = hour % 12
  return period === 'pm' ? normalized + 12 : normalized
}

export function setTimePeriod(value: TimeValue, period: TimePeriod): TimeValue {
  return { ...value, hour: from12Hour(to12Hour(value.hour), period) }
}

function clampInteger(value: number, min: number, max: number): number {
  if (!Number.isFinite(value)) return min
  return Math.min(max, Math.max(min, Math.trunc(value)))
}
