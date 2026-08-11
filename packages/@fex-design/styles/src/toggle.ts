import { cva, type VariantProps } from 'class-variance-authority'
import { buttonPrimitiveClassName } from './button'

export const toggleClassName = cva(`${buttonPrimitiveClassName} w-fit`, {
  variants: {
    variant: {
      default:
        'border-transparent bg-transparent text-foreground hover:bg-muted-background data-[state=on]:bg-muted-background',
      outline:
        'border-border bg-background text-foreground shadow-xs hover:bg-muted-background data-[state=on]:bg-muted-background',
    },
    size: {
      sm: 'h-7 gap-1 px-2 text-xs [&_svg:not([class*=size-])]:size-3.5',
      default: 'h-8 gap-1.5 px-2.5 text-sm',
      lg: 'h-9 gap-1.5 px-3 text-sm',
    },
  },
  defaultVariants: { variant: 'default', size: 'default' },
})

export const toggleGroupClassName = cva('inline-flex w-fit items-center', {
  variants: {
    orientation: { horizontal: 'flex-row', vertical: 'flex-col items-stretch' },
    variant: {
      default: '',
      outline: '',
    },
    connected: {
      true:
        '[&>[data-slot=toggle]]:rounded-none [&>[data-slot=toggle]:first-child]:rounded-l-md [&>[data-slot=toggle]:last-child]:rounded-r-md data-[orientation=vertical]:[&>[data-slot=toggle]:first-child]:rounded-t-md data-[orientation=vertical]:[&>[data-slot=toggle]:last-child]:rounded-b-md data-[orientation=vertical]:[&>[data-slot=toggle]:first-child]:rounded-bl-none data-[orientation=vertical]:[&>[data-slot=toggle]:last-child]:rounded-tr-none',
      false: '',
    },
  },
  defaultVariants: { orientation: 'horizontal', variant: 'default', connected: false },
})

export type ToggleStyleProps = VariantProps<typeof toggleClassName>
export type ToggleGroupStyleProps = VariantProps<typeof toggleGroupClassName>
