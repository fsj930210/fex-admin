import type { CalendarValue } from '@fex/components-core/calendar'
import { type JSX, splitProps, type ParentProps } from 'solid-js'
import { Popover, type PopoverProps } from '../popover/popover'
import { DatePickerContext } from './context'
import { useDatePicker, type UseDatePickerOptions } from './use-date-picker'

export interface DatePickerRootProps<TValue extends CalendarValue = CalendarValue>
  extends ParentProps<Omit<PopoverProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'children'>>,
    UseDatePickerOptions<TValue> {}

export function DatePickerRoot<TValue extends CalendarValue = CalendarValue>(props: DatePickerRootProps<TValue>): JSX.Element {
  const [local, rest] = splitProps(props, [
    'children',
    'picker',
    'status',
    'value',
    'defaultValue',
    'open',
    'defaultOpen',
    'multiple',
    'needConfirm',
    'disabled',
    'readOnly',
    'allowClear',
    'format',
    'weekStartsOn',
    'minDate',
    'maxDate',
    'disabledDate',
    'onChange',
    'onOpenChange',
  ])
  const datePicker = useDatePicker<TValue>(local)
  return (
    <Popover {...rest} open={datePicker.open()} onOpenChange={datePicker.setOpen} placement={rest.placement ?? 'bottom'} sideOffset={rest.sideOffset ?? 6} trigger={datePicker.disabled ? [] : ['focus', 'click']}>
      <DatePickerContext.Provider value={datePicker as never}>{local.children}</DatePickerContext.Provider>
    </Popover>
  )
}
