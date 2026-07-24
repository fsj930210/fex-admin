import { timePickerRootClassName } from '@fex/components-styles/time-picker'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { PopoverContent, PopoverPortal } from '../popover/popover'

export interface TimePickerContentProps extends ComponentProps<typeof PopoverContent> {}

export function TimePickerContent({ className, style, ...props }: TimePickerContentProps) {
  return (
    <PopoverPortal>
      <PopoverContent
        {...props}
        className={cn('overflow-hidden p-0', className)}
        style={{
          width: 'var(--floating-reference-width)',
          maxWidth: 'var(--floating-available-width)',
          maxHeight: 'var(--floating-available-height)',
          ...style,
        }}
      />
    </PopoverPortal>
  )
}

export function TimePickerPanel(props: ComponentProps<'div'>) {
  return <div {...props} data-slot="time-picker-panel" className={cn(timePickerRootClassName, props.className)} />
}
