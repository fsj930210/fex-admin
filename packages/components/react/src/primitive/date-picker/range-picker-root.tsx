import type { CalendarValue } from '@fex/components-core/calendar'
import type { ReactNode } from 'react'
import { PopoverRoot, type PopoverRootProps } from '../popover/popover'
import { RangePickerContext } from './context'
import { useRangePicker, type UseRangePickerOptions } from './use-range-picker'

export interface RangePickerRootProps<TValue extends CalendarValue = CalendarValue>
  extends Omit<PopoverRootProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'children'>,
    UseRangePickerOptions<TValue> {
  children?: ReactNode
}

export function RangePickerRoot<TValue extends CalendarValue = CalendarValue>({
  children,
  placement = 'bottomLeft',
  sideOffset = 6,
  picker,
  value,
  defaultValue,
  open,
  defaultOpen,
  needConfirm,
  disabled,
  readOnly,
  allowClear,
  allowEmpty,
  order,
  format,
  weekStartsOn,
  minDate,
  maxDate,
  disabledDate,
  onChange,
  onOpenChange,
  ...props
}: RangePickerRootProps<TValue>) {
  const rangePicker = useRangePicker<TValue>({
    ...(picker ? { picker } : {}),
    ...(value !== undefined ? { value } : {}),
    ...(defaultValue !== undefined ? { defaultValue } : {}),
    ...(open !== undefined ? { open } : {}),
    ...(defaultOpen !== undefined ? { defaultOpen } : {}),
    ...(needConfirm !== undefined ? { needConfirm } : {}),
    ...(disabled !== undefined ? { disabled } : {}),
    ...(readOnly !== undefined ? { readOnly } : {}),
    ...(allowClear !== undefined ? { allowClear } : {}),
    ...(allowEmpty !== undefined ? { allowEmpty } : {}),
    ...(order !== undefined ? { order } : {}),
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
      open={rangePicker.open}
      onOpenChange={rangePicker.setOpen}
      placement={placement}
      sideOffset={sideOffset}
      trigger={['focus', 'click']}
    >
      <RangePickerContext value={rangePicker as never}>{children}</RangePickerContext>
    </PopoverRoot>
  )
}
