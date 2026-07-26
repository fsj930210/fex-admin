import { getCalendarValueDate } from '../calendar/value'
import { isAfterDate, isBeforeDate } from '../date/utils'
import type { CalendarDate, CalendarValue } from '../calendar/types'
import type { DatePickerConstraintOptions, DatePickerDisabledDateInfo } from './types'

export function createDatePickerDisabledDate<TValue extends CalendarValue = CalendarValue>(
  options: DatePickerConstraintOptions<TValue>,
) {
  return (date: CalendarDate, info?: Partial<DatePickerDisabledDateInfo<TValue>>) => {
    if (options.minDate && isBeforeDate(date, options.minDate)) return true
    if (options.maxDate && isAfterDate(date, options.maxDate)) return true
    return Boolean(
      options.disabledDate?.(date, {
        picker: options.picker,
        panel: options.panel,
        ...info,
      }),
    )
  }
}

export function isDatePickerValueDisabled<TValue extends CalendarValue>(
  value: TValue,
  options: DatePickerConstraintOptions<TValue>,
  info?: Partial<DatePickerDisabledDateInfo<TValue>>,
): boolean {
  return createDatePickerDisabledDate(options)(getCalendarValueDate(value), info)
}
