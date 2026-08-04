import { Temporal } from './temporal'
import type {
  CalendarDate,
  CalendarGranularity,
  CalendarQuarter,
  CalendarValue,
  CalendarWeek,
  CalendarYear,
  CalendarYearMonth,
} from './types'

export function isCalendarDate(value: CalendarValue): value is CalendarDate {
  return value instanceof Temporal.PlainDate
}

export function isCalendarYearMonth(value: CalendarValue): value is CalendarYearMonth {
  return value instanceof Temporal.PlainYearMonth
}

export function isCalendarWeek(value: CalendarValue): value is CalendarWeek {
  return 'start' in value && 'end' in value
}

export function isCalendarQuarter(value: CalendarValue): value is CalendarQuarter {
  return 'quarter' in value
}

export function isCalendarYear(value: CalendarValue): value is CalendarYear {
  return (
    !isCalendarDate(value) &&
    !isCalendarYearMonth(value) &&
    !isCalendarWeek(value) &&
    !isCalendarQuarter(value) &&
    'year' in value
  )
}

export function getCalendarValueDate(value: CalendarValue): CalendarDate {
  if (isCalendarDate(value)) return value
  if (isCalendarWeek(value)) return value.start
  if (isCalendarYearMonth(value)) return value.toPlainDate({ day: 1 })
  if (isCalendarQuarter(value))
    return Temporal.PlainDate.from({ year: value.year, month: (value.quarter - 1) * 3 + 1, day: 1 })
  return Temporal.PlainDate.from({ year: value.year, month: 1, day: 1 })
}

export function compareCalendarValue(left: CalendarValue, right: CalendarValue): number {
  return Temporal.PlainDate.compare(getCalendarValueDate(left), getCalendarValueDate(right))
}

export function isSameCalendarValue(
  left: CalendarValue | null | undefined,
  right: CalendarValue | null | undefined,
): boolean {
  if (!left || !right) return false
  return getCalendarValueKey(left) === getCalendarValueKey(right)
}

export function getCalendarValueKey(value: CalendarValue): string {
  if (isCalendarDate(value)) return `date:${value.toString()}`
  if (isCalendarWeek(value)) return `week:${value.start.toString()}`
  if (isCalendarYearMonth(value)) return `month:${value.toString()}`
  if (isCalendarQuarter(value)) return `quarter:${value.year}-Q${value.quarter}`
  return `year:${value.year}`
}

export function getCalendarValueLabel(
  value: CalendarValue,
  granularity: CalendarGranularity,
): string {
  if (granularity === 'date' && isCalendarDate(value)) return String(value.day)
  if (granularity === 'week' && isCalendarWeek(value)) return String(value.start.day)
  if (granularity === 'month' && isCalendarYearMonth(value)) return String(value.month)
  if (granularity === 'quarter' && isCalendarQuarter(value)) return `Q${value.quarter}`
  if (granularity === 'year' && isCalendarYear(value)) return String(value.year)
  return getCalendarValueDate(value).toString()
}
