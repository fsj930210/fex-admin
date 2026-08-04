import { getContext } from 'svelte'
import type {
  CalendarDate,
  CalendarPanel,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex-design/core/calendar'
import type { DatePickerPicker } from '@fex-design/core/date-picker/types'

export const datePickerContextKey = Symbol('DatePickerContext')
export const rangePickerContextKey = Symbol('RangePickerContext')

export type DatePickerSelectionValue<TValue extends CalendarValue = CalendarValue> =
  | TValue
  | readonly TValue[]
  | null

export interface DatePickerContextValue<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  status?: 'error' | 'warning' | undefined
  multiple: boolean
  needConfirm: boolean
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  format: string
  weekStartsOn: CalendarWeekday
  getOpen: () => boolean
  getPanel: () => CalendarPanel
  getViewDate: () => CalendarDate
  getValue: () => DatePickerSelectionValue<TValue>
  getCalendarValue: () => TValue | null
  getCalendarValues: () => readonly TValue[]
  minDate?: CalendarDate | undefined
  maxDate?: CalendarDate | undefined
  disabledDate?: ((date: CalendarDate) => boolean) | undefined
  setPanel: (panel: CalendarPanel) => void
  setViewDate: (viewDate: CalendarDate) => void
  setOpen: (open: boolean) => void
  openPanel: () => void
  close: () => void
  clear: () => void
  confirm: () => void
  cancel: () => void
  select: (value: TValue) => void
}

export interface RangePickerContextValue<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  status?: 'error' | 'warning' | undefined
  needConfirm: boolean
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  allowEmpty: { start: boolean; end: boolean }
  format: string
  weekStartsOn: CalendarWeekday
  getOpen: () => boolean
  getPanel: () => CalendarPanel
  getViewDate: () => CalendarDate
  getRangeValue: () => CalendarRange<TValue>
  getActivePart: () => 'start' | 'end'
  getHoverValue: () => TValue | null
  minDate?: CalendarDate | undefined
  maxDate?: CalendarDate | undefined
  disabledDate?: ((date: CalendarDate, activePart: 'start' | 'end') => boolean) | undefined
  setPanel: (panel: CalendarPanel) => void
  setViewDate: (viewDate: CalendarDate) => void
  setOpen: (open: boolean) => void
  setActivePart: (part: 'start' | 'end') => void
  setHoverValue: (value: TValue | null) => void
  openPanel: (part?: 'start' | 'end') => void
  close: () => void
  clear: () => void
  confirm: () => void
  cancel: () => void
  select: (value: TValue) => void
}

export function useDatePickerContext(component: string): DatePickerContextValue {
  const context = getContext<DatePickerContextValue | undefined>(datePickerContextKey)
  if (!context) throw new Error(`${component} must be used within DatePickerRoot`)
  return context
}

export function useRangePickerContext(component: string): RangePickerContextValue {
  const context = getContext<RangePickerContextValue | undefined>(rangePickerContextKey)
  if (!context) throw new Error(`${component} must be used within RangePickerRoot`)
  return context
}
