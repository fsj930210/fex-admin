import { Temporal } from '../calendar/temporal'
import type { CalendarDate, CalendarQuarter, CalendarWeekday, CalendarYear } from '../calendar/types'

export interface CalendarDateFields {
  year?: number
  month?: number
  day?: number
}

export interface CalendarDateDuration {
  years?: number
  months?: number
  weeks?: number
  days?: number
}

export type CalendarDateUnit = 'day' | 'week' | 'month' | 'quarter' | 'year'

export function setDate(date: CalendarDate, fields: CalendarDateFields): CalendarDate {
  return date.with(fields)
}

export function setYear(date: CalendarDate, year: number): CalendarDate {
  return setDate(date, { year })
}

export function setMonth(date: CalendarDate, month: number): CalendarDate {
  return setDate(date, { month })
}

export function setDay(date: CalendarDate, day: number): CalendarDate {
  return setDate(date, { day })
}

export function addDate(date: CalendarDate, duration: CalendarDateDuration): CalendarDate {
  return date.add(toTemporalDuration(duration))
}

export function subtractDate(date: CalendarDate, duration: CalendarDateDuration): CalendarDate {
  return date.subtract(toTemporalDuration(duration))
}

export function startOfDate(date: CalendarDate, unit: CalendarDateUnit): CalendarDate {
  if (unit === 'day') return date
  if (unit === 'week') return date.subtract({ days: date.dayOfWeek % 7 })
  if (unit === 'month') return date.with({ day: 1 })
  if (unit === 'quarter') return date.with({ month: getQuarter(date).quarter * 3 - 2, day: 1 })
  return date.with({ month: 1, day: 1 })
}

export function endOfDate(date: CalendarDate, unit: CalendarDateUnit): CalendarDate {
  return addDate(startOfDate(date, unit), getUnitDuration(unit)).subtract({
    days: 1,
  })
}

export function isBeforeDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) < 0
}

export function isAfterDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) > 0
}

export function isSameOrBeforeDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) <= 0
}

export function isSameOrAfterDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) >= 0
}

export function isBetweenDate(
  date: CalendarDate,
  start: CalendarDate,
  end: CalendarDate,
  inclusive = true,
): boolean {
  if (inclusive) {
    return isSameOrAfterDate(date, start) && isSameOrBeforeDate(date, end)
  }
  return isAfterDate(date, start) && isBeforeDate(date, end)
}

export function minDate(left: CalendarDate, right: CalendarDate): CalendarDate {
  return isBeforeDate(left, right) ? left : right
}

export function maxDate(left: CalendarDate, right: CalendarDate): CalendarDate {
  return isAfterDate(left, right) ? left : right
}

export function clampDate(date: CalendarDate, min?: CalendarDate, max?: CalendarDate): CalendarDate {
  if (min && isBeforeDate(date, min)) return min
  if (max && isAfterDate(date, max)) return max
  return date
}

export function getQuarter(date: CalendarDate): CalendarQuarter {
  return { year: date.year, quarter: (Math.floor((date.month - 1) / 3) + 1) as 1 | 2 | 3 | 4 }
}

export function setQuarter(date: CalendarDate, quarter: CalendarQuarter['quarter']) {
  return date.with({ month: (quarter - 1) * 3 + 1, day: 1 })
}

export function getYear(date: CalendarDate): CalendarYear {
  return { year: date.year }
}

export function getWeekStart(date: CalendarDate, weekStartsOn: CalendarWeekday = 0): CalendarDate {
  const offset = (date.dayOfWeek - weekStartsOn + 7) % 7
  return date.subtract({ days: offset })
}

export function getWeekEnd(date: CalendarDate, weekStartsOn: CalendarWeekday = 0): CalendarDate {
  return getWeekStart(date, weekStartsOn).add({ days: 6 })
}

function toTemporalDuration(duration: CalendarDateDuration) {
  return {
    ...(duration.years ? { years: duration.years } : {}),
    ...(duration.months ? { months: duration.months } : {}),
    ...(duration.weeks ? { weeks: duration.weeks } : {}),
    ...(duration.days ? { days: duration.days } : {}),
  }
}

function getUnitDuration(unit: CalendarDateUnit): CalendarDateDuration {
  if (unit === 'day') return { days: 1 }
  if (unit === 'week') return { weeks: 1 }
  if (unit === 'month') return { months: 1 }
  if (unit === 'quarter') return { months: 3 }
  return { years: 1 }
}
