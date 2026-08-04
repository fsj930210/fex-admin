import { compareCalendarValue } from './value'
import type { CalendarRange, CalendarValue } from './types'

export function normalizeCalendarRange<TValue extends CalendarValue>(
  range: CalendarRange<TValue>,
): CalendarRange<TValue> {
  if (!range.start || !range.end) return range
  return compareCalendarValue(range.start, range.end) <= 0
    ? range
    : { start: range.end, end: range.start }
}

export function isCalendarValueInRange(value: CalendarValue, range?: CalendarRange): boolean {
  if (!range?.start || !range.end) return false
  const orderedRange = normalizeCalendarRange(range)
  const { start, end } = orderedRange
  if (!start || !end) return false
  return compareCalendarValue(value, start) >= 0 && compareCalendarValue(value, end) <= 0
}
