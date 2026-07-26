import type { CalendarRange, CalendarValue } from '../calendar/types'
import { formatDatePickerValue, parseDatePickerValue, type DatePickerParseResult } from './value'
import type { DatePickerFormatOptions, DatePickerPicker, DatePickerValue } from './types'

export function getDatePickerDisplayText(
  value: CalendarValue | null | undefined,
  options: DatePickerFormatOptions,
): string {
  return formatDatePickerValue(value, options)
}

export function getRangePickerDisplayTexts(
  value: CalendarRange | null | undefined,
  options: DatePickerFormatOptions,
): [string, string] {
  return [
    formatDatePickerValue(value?.start, options),
    formatDatePickerValue(value?.end, options),
  ]
}

export function parseDatePickerInputText<TPicker extends DatePickerPicker>(
  text: string,
  options: DatePickerFormatOptions & { picker: TPicker },
): DatePickerParseResult<DatePickerValue<TPicker>> {
  return parseDatePickerValue(text, options)
}
