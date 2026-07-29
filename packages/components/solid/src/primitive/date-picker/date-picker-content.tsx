import { datePickerContentClassName } from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { splitProps, type ParentProps } from 'solid-js'
import { PopoverContent, PopoverPortal, type PopoverContentProps } from '../popover/popover'

export interface DatePickerContentProps extends ParentProps<PopoverContentProps> {}

export function DatePickerContent(props: DatePickerContentProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return (
    <PopoverPortal>
      <PopoverContent {...rest} class={cn(datePickerContentClassName, local.class)}>
        {local.children}
      </PopoverContent>
    </PopoverPortal>
  )
}

export const RangePickerContent = DatePickerContent
