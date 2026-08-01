import { Temporal } from '../calendar/temporal'
import {
  compareCalendarValue,
  getCalendarValueDate,
  getCalendarValueKey,
  isSameCalendarValue,
} from '../calendar/value'
import { format, parse } from '../date/utils'
import { getQuarter, getWeekEnd, getWeekStart, getYear } from '../date/utils'
import type {
  CalendarDate,
  CalendarQuarter,
  CalendarValue,
  CalendarWeekday,
  CalendarYear,
  CalendarYearMonth,
} from '../calendar/types'
import type { DatePickerFormatOptions, DatePickerPicker, DatePickerValue } from './types'

export { compareCalendarValue as compareDatePickerValue }
export { getCalendarValueDate as getDatePickerValueDate }
export { getCalendarValueKey as getDatePickerValueKey }
export { isSameCalendarValue as isSameDatePickerValue }

export type DatePickerParseResult<TValue extends CalendarValue = CalendarValue> =
  | { valid: true; value: TValue }
  | { valid: false; reason: 'empty' | 'invalid' }

export function getDefaultDatePickerFormat(picker: DatePickerPicker): string {
  if (picker === 'month') return 'YYYY-MM'
  if (picker === 'year') return 'YYYY'
  if (picker === 'quarter') return 'YYYY-[Q]Q'
  if (picker === 'week') return 'YYYY-W'
  return 'YYYY-MM-DD'
}

export function normalizeDatePickerValue<TPicker extends DatePickerPicker>(
  date: CalendarDate,
  picker: TPicker,
  weekStartsOn: CalendarWeekday = 0,
): DatePickerValue<TPicker> {
  if (picker === 'week') {
    const start = getWeekStart(date, weekStartsOn)
    return { start, end: getWeekEnd(start, weekStartsOn) } as DatePickerValue<TPicker>
  }
  if (picker === 'month') {
    return Temporal.PlainYearMonth.from({
      year: date.year,
      month: date.month,
    }) as DatePickerValue<TPicker>
  }
  if (picker === 'quarter') return getQuarter(date) as DatePickerValue<TPicker>
  if (picker === 'year') return getYear(date) as DatePickerValue<TPicker>
  return date as DatePickerValue<TPicker>
}

export function formatDatePickerValue(
  value: CalendarValue | null | undefined,
  options: DatePickerFormatOptions,
): string {
  if (!value) return ''
  if (options.picker === 'week') {
    const date = getCalendarValueDate(value) as CalendarDate & {
      yearOfWeek?: number
      weekOfYear?: number
    }
    const year = date.yearOfWeek ?? date.year
    const week = date.weekOfYear
    return week ? `${year}-${week}周` : format(date, options.format ?? 'YYYY-MM-DD')
  }
  if (options.picker === 'quarter') {
    const quarter = value as CalendarQuarter
    const pattern = options.format ?? getDefaultDatePickerFormat(options.picker)
    return pattern.replace('YYYY', String(quarter.year)).replace('[Q]Q', `Q${quarter.quarter}`)
  }
  if (options.picker === 'year') {
    const year = value as CalendarYear
    return String(year.year)
  }
  return format(
    getCalendarValueDate(value),
    options.format ?? getDefaultDatePickerFormat(options.picker),
  )
}

export function parseDatePickerValue<TPicker extends DatePickerPicker>(
  text: string,
  options: DatePickerFormatOptions & { picker: TPicker },
): DatePickerParseResult<DatePickerValue<TPicker>> {
  const trimmed = text.trim()
  if (!trimmed) return { valid: false, reason: 'empty' }
  if (options.picker === 'year') {
    const year = Number(trimmed)
    if (!Number.isInteger(year)) return { valid: false, reason: 'invalid' }
    return { valid: true, value: { year } as DatePickerValue<TPicker> }
  }
  if (options.picker === 'quarter') {
    const match = /^(\d{4})-?Q([1-4])$/i.exec(trimmed)
    if (!match) return { valid: false, reason: 'invalid' }
    return {
      valid: true,
      value: {
        year: Number(match[1]),
        quarter: Number(match[2]) as 1 | 2 | 3 | 4,
      } as DatePickerValue<TPicker>,
    }
  }
  const result = parse(trimmed, options.format ?? getDefaultDatePickerFormat(options.picker))
  if (
    !result.valid ||
    !result.value.year ||
    !result.value.month ||
    (options.picker === 'date' && !result.value.day)
  ) {
    return { valid: false, reason: 'invalid' }
  }
  const date = Temporal.PlainDate.from({
    year: result.value.year,
    month: result.value.month,
    day: result.value.day ?? 1,
  })
  return {
    valid: true,
    value: normalizeDatePickerValue(date, options.picker, options.weekStartsOn),
  }
}

export function datePickerValueToPlainDate(value: CalendarValue): CalendarDate {
  return getCalendarValueDate(value)
}

export function datePickerValueToPlainYearMonth(value: CalendarYearMonth): CalendarYearMonth {
  return value
}
