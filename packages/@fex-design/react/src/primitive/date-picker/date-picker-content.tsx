import type { ComponentProps } from 'react'
import { PopoverContent, PopoverPortal } from '../popover/popover'

export interface DatePickerContentProps extends ComponentProps<typeof PopoverContent> {}

export function DatePickerContent({ style, className, ...props }: DatePickerContentProps) {
  return (
    <PopoverPortal>
      <PopoverContent
        {...props}
        data-slot="date-picker-content"
        className={className}
        style={{
          minWidth: 'var(--floating-reference-width)',
          maxWidth: 'var(--floating-available-width)',
          maxHeight: 'var(--floating-available-height)',
          ...style,
        }}
      />
    </PopoverPortal>
  )
}

export const RangePickerContent = DatePickerContent
