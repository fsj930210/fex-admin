import type { CalendarValue } from '@fex/components-core/calendar'
import { splitProps, type JSX, type ParentProps } from 'solid-js'
import { Popover, type PopoverProps } from '../popover/popover'
import { RangePickerContext } from './context'
import { useRangePicker, type UseRangePickerOptions } from './use-range-picker'

export interface RangePickerRootProps<TValue extends CalendarValue = CalendarValue>
  extends
    ParentProps<Omit<PopoverProps, 'open' | 'defaultOpen' | 'onOpenChange' | 'children'>>,
    UseRangePickerOptions<TValue> {}

export function RangePickerRoot<TValue extends CalendarValue = CalendarValue>(
  props: RangePickerRootProps<TValue>,
): JSX.Element {
  const [local, rest] = splitProps(props, [
    'children',
    'picker',
    'status',
    'value',
    'defaultValue',
    'open',
    'defaultOpen',
    'needConfirm',
    'disabled',
    'readOnly',
    'allowClear',
    'allowEmpty',
    'order',
    'format',
    'weekStartsOn',
    'minDate',
    'maxDate',
    'disabledDate',
    'onChange',
    'onOpenChange',
  ])
  const rangePicker = useRangePicker<TValue>(local)
  return (
    <Popover
      {...rest}
      open={rangePicker.open()}
      onOpenChange={rangePicker.setOpen}
      placement={rest.placement ?? 'bottom'}
      sideOffset={rest.sideOffset ?? 6}
      trigger={rangePicker.disabled ? [] : ['focus', 'click']}
    >
      <RangePickerContext.Provider value={rangePicker as never}>
        {local.children}
      </RangePickerContext.Provider>
    </Popover>
  )
}
