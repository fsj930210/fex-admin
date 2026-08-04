import type { CalendarValue } from '@fex-design/core/calendar'
import type { ReactNode } from 'react'
import { PopoverRoot, type PopoverRootProps } from '../popover/popover'
import { DatePickerContext } from './context'
import { useDatePicker, type UseDatePickerOptions } from './use-date-picker'

export interface DatePickerRootProps<TValue extends CalendarValue = CalendarValue>
  extends
    Omit<PopoverRootProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'children'>,
    UseDatePickerOptions<TValue> {
  children?: ReactNode
}

export function DatePickerRoot<TValue extends CalendarValue = CalendarValue>({
  children,
  placement = 'bottom',
  sideOffset = 6,
  picker,
  status,
  value,
  defaultValue,
  open,
  defaultOpen,
  multiple,
  needConfirm,
  disabled,
  readOnly,
  allowClear,
  format,
  weekStartsOn,
  minDate,
  maxDate,
  disabledDate,
  onChange,
  onOpenChange,
  ...props
}: DatePickerRootProps<TValue>) {
  const datePicker = useDatePicker<TValue>({
    ...(picker ? { picker } : {}),
    ...(status ? { status } : {}),
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(multiple !== undefined ? { multiple } : {}),
    ...(needConfirm !== undefined ? { needConfirm } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(readOnly !== undefined ? { readOnly } : {}),
    ...(allowClear !== undefined ? { allowClear } : {}),
    ...(format ? { format } : {}),
    ...(weekStartsOn !== undefined ? { weekStartsOn } : {}),
    ...(minDate ? { minDate } : {}),
    ...(maxDate ? { maxDate } : {}),
    ...(disabledDate ? { disabledDate } : {}),
    ...(onChange ? { onChange } : {}),
    ...(onOpenChange ? { onOpenChange } : {}),
  })

  return (
    <PopoverRoot
      {...props}
      open={datePicker.open}
      onOpenChange={datePicker.setOpen}
      placement={placement}
      sideOffset={sideOffset}
      trigger={['focus', 'click']}
    >
      <DatePickerContext value={datePicker as never}>{children}</DatePickerContext>
    </PopoverRoot>
  )
}
