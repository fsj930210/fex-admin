import type {
  CalendarDate,
  CalendarPanel,
  CalendarQuarter,
  CalendarRange,
  CalendarValue,
  CalendarWeek,
  CalendarWeekday,
  CalendarYear,
  CalendarYearMonth,
} from '../calendar/types'

export type DatePickerPicker = 'date' | 'week' | 'month' | 'quarter' | 'year'

export interface DatePickerValueMap {
  date: CalendarDate
  week: CalendarWeek
  month: CalendarYearMonth
  quarter: CalendarQuarter
  year: CalendarYear
}

export type DatePickerValue<TPicker extends DatePickerPicker = DatePickerPicker> =
  DatePickerValueMap[TPicker]

export type DatePickerInputPart = 'start' | 'end'

export type DatePickerHeaderAction =
  | 'previous-year'
  | 'previous-month'
  | 'next-month'
  | 'next-year'
  | 'previous-panel'
  | 'next-panel'

export type DatePickerHeaderLabelPart = 'year' | 'month'

export interface DatePickerDisabledDateInfo<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  panel: CalendarPanel
  activePart?: DatePickerInputPart | undefined
  from?: TValue | null | undefined
  value?: TValue | readonly TValue[] | null | undefined
  rangeValue?: CalendarRange<TValue> | undefined
}

export interface DatePickerConstraintOptions<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  panel: CalendarPanel
  minDate?: CalendarDate | undefined
  maxDate?: CalendarDate | undefined
  disabledDate?: (
    date: CalendarDate,
    info: DatePickerDisabledDateInfo<TValue>,
  ) => boolean
}

export interface DatePickerFormatOptions {
  picker: DatePickerPicker
  format?: string | undefined
  weekStartsOn?: CalendarWeekday | undefined
}
