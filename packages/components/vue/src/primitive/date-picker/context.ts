import type {
  CalendarDate,
  CalendarPanel,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'
import { inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'

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
  open: ComputedRef<boolean>
  panel: Ref<CalendarPanel>
  viewDate: Ref<CalendarDate>
  value: ComputedRef<DatePickerSelectionValue<TValue>>
  calendarValue: ComputedRef<TValue | null>
  calendarValues: ComputedRef<readonly TValue[]>
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
  open: ComputedRef<boolean>
  panel: Ref<CalendarPanel>
  viewDate: Ref<CalendarDate>
  rangeValue: ComputedRef<CalendarRange<TValue>>
  activePart: Ref<'start' | 'end'>
  hoverValue: Ref<TValue | null>
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

export const datePickerContextKey: InjectionKey<DatePickerContextValue> =
  Symbol('DatePickerContext')
export const rangePickerContextKey: InjectionKey<RangePickerContextValue> =
  Symbol('RangePickerContext')

export function useDatePickerContext(component: string): DatePickerContextValue {
  const context = inject(datePickerContextKey)
  if (!context) throw new Error(`${component} must be used within DatePickerRoot`)
  return context
}

export function useRangePickerContext(component: string): RangePickerContextValue {
  const context = inject(rangePickerContextKey)
  if (!context) throw new Error(`${component} must be used within RangePickerRoot`)
  return context
}
