import type { CalendarDate, CalendarYearMonth } from './types'

interface CalendarPlainDateConstructor extends Function {
  from(value: { year: number; month: number; day: number }): CalendarDate
  compare(left: CalendarDate, right: CalendarDate): number
}

interface CalendarPlainYearMonthConstructor extends Function {
  from(value: { year: number; month: number }): CalendarYearMonth
}

interface CalendarTemporal {
  PlainDate: CalendarPlainDateConstructor
  PlainYearMonth: CalendarPlainYearMonthConstructor
  Now: {
    plainDateISO(): CalendarDate
  }
}

function getTemporal(): CalendarTemporal {
  const temporal = (globalThis as { Temporal?: CalendarTemporal }).Temporal
  if (!temporal) {
    throw new Error(
      'Calendar requires native Temporal support. Please run it in an environment with Temporal enabled.',
    )
  }
  return temporal
}

export const Temporal = getTemporal()

export function createCalendarDate(year: number, month: number, day = 1): CalendarDate {
  return Temporal.PlainDate.from({ year, month, day })
}

export function getCalendarToday(): CalendarDate {
  return Temporal.Now.plainDateISO()
}

export function createCalendarYearMonth(year: number, month: number) {
  return Temporal.PlainYearMonth.from({ year, month })
}

export function isSameCalendarDate(left: CalendarDate, right: CalendarDate): boolean {
  return Temporal.PlainDate.compare(left, right) === 0
}

export function compareCalendarDate(left: CalendarDate, right: CalendarDate): number {
  return Temporal.PlainDate.compare(left, right)
}

export function getCalendarDateKey(date: CalendarDate): string {
  return date.toString()
}

export function getMonthStart(date: CalendarDate): CalendarDate {
  return date.with({ day: 1 })
}

export function getYearStart(date: CalendarDate): CalendarDate {
  return date.with({ month: 1, day: 1 })
}

export function getDayIndex(date: CalendarDate): 0 | 1 | 2 | 3 | 4 | 5 | 6 {
  return (date.dayOfWeek % 7) as 0 | 1 | 2 | 3 | 4 | 5 | 6
}
