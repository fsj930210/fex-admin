import type {
  CalendarDate,
  CalendarPanel,
  CalendarRange,
  CalendarValue,
  CalendarWeekday,
} from '@fex/components-core/calendar'
import type { DatePickerPicker } from '@fex/components-core/date-picker/types'

export type DatePickerSelectionValue<TValue extends CalendarValue = CalendarValue> =
  | TValue
  | readonly TValue[]
  | null

export interface DatePickerContextValue<TValue extends CalendarValue = CalendarValue> {
  picker: DatePickerPicker
  multiple: boolean
  needConfirm: boolean
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  format: string
  weekStartsOn: CalendarWeekday
  open: boolean
  panel: CalendarPanel
  viewDate: CalendarDate
  value: DatePickerSelectionValue<TValue>
  calendarValue: TValue | null
  calendarValues: readonly TValue[]
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
  needConfirm: boolean
  disabled: boolean
  readOnly: boolean
  allowClear: boolean
  allowEmpty: { start: boolean; end: boolean }
  format: string
  weekStartsOn: CalendarWeekday
  open: boolean
  panel: CalendarPanel
  viewDate: CalendarDate
  rangeValue: CalendarRange<TValue>
  activePart: 'start' | 'end'
  hoverValue: TValue | null
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
