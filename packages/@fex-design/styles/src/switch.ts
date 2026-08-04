import { cva, type VariantProps } from 'class-variance-authority'

export const switchClassName = cva(
  [
    'peer inline-flex shrink-0 cursor-pointer items-center rounded-[5px] border border-border bg-muted-background shadow-xs outline-none transition-colors duration-150 ease-out',
    'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
    'disabled:cursor-not-allowed disabled:border-disabled-border disabled:bg-disabled-background',
    'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20',
    'data-[state=checked]:border-primary data-[state=checked]:bg-primary disabled:data-[state=checked]:border-disabled-foreground disabled:data-[state=checked]:bg-disabled-foreground',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-4 w-7 p-0.5',
        default: 'h-5 w-9 p-0.5',
        lg: 'h-6 w-11 p-0.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const switchThumbClassName = cva(
  [
    'pointer-events-none block rounded-[3px] bg-background shadow-sm ring-0 transition-transform duration-150 ease-out',
    'data-[state=unchecked]:translate-x-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'size-3 data-[state=checked]:translate-x-3',
        default: 'size-4 data-[state=checked]:translate-x-4',
        lg: 'size-5 data-[state=checked]:translate-x-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export type SwitchStyleProps = VariantProps<typeof switchClassName>
