import { isCalendarValueInRange, normalizeCalendarRange } from '../calendar/range'
import { compareCalendarValue } from '../calendar/value'
import type { CalendarRange, CalendarValue } from '../calendar/types'
import type { DatePickerInputPart } from './types'

export { isCalendarValueInRange as isDatePickerValueInRange }
export { normalizeCalendarRange as normalizeDatePickerRange }

export function getRangeActivePart<TValue extends CalendarValue>(
  range: CalendarRange<TValue> | undefined,
): DatePickerInputPart {
  return range?.start && !range.end ? 'end' : 'start'
}

export function getRangeFromValue<TValue extends CalendarValue>(
  range: CalendarRange<TValue> | undefined,
  activePart: DatePickerInputPart,
): TValue | null {
  return (activePart === 'start' ? range?.end : range?.start) ?? null
}

export function createNextRangeValue<TValue extends CalendarValue>(
  range: CalendarRange<TValue> | undefined,
  next: TValue,
  activePart: DatePickerInputPart,
  order = true,
): CalendarRange<TValue> {
  const nextRange: CalendarRange<TValue> = {}
  if (activePart === 'start') {
    nextRange.start = next
    if (range?.end) nextRange.end = range.end
  } else {
    if (range?.start) nextRange.start = range.start
    nextRange.end = next
  }
  return order ? normalizeCalendarRange(nextRange) : nextRange
}

export function isDatePickerValueInHoverRange<TValue extends CalendarValue>(
  value: TValue,
  range: CalendarRange<TValue> | undefined,
  hoverValue: TValue | null | undefined,
  activePart: DatePickerInputPart,
): boolean {
  if (!hoverValue) return false
  const from = getRangeFromValue(range, activePart)
  if (!from) return false
  const hoverRange = normalizeCalendarRange({ start: from, end: hoverValue })
  if (!hoverRange.start || !hoverRange.end) return false
  return compareCalendarValue(value, hoverRange.start) >= 0 && compareCalendarValue(value, hoverRange.end) <= 0
}
