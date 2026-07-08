import { cva, type VariantProps } from 'class-variance-authority'

export const radioGroupClassName = cva('grid min-w-0 gap-2', {
  variants: {
    orientation: {
      horizontal: 'grid-flow-col auto-cols-max items-center',
      vertical: 'grid-flow-row',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export const radioRootClassName = cva(
  [
    'peer inline-flex shrink-0 items-center justify-center rounded-full border border-border bg-background text-primary shadow-xs',
    'outline-none transition-none',
    'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20',
    'data-[state=checked]:border-primary',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'size-3.5',
        default: 'size-4',
        lg: 'size-5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const radioIndicatorClassName = cva('block rounded-full bg-current transition-none', {
  variants: {
    size: {
      sm: 'size-1.5',
      default: 'size-2',
      lg: 'size-2.5',
    },
  },
  defaultVariants: {
    size: 'default',
  },
})

export const radioButtonClassName = cva(
  [
    'relative -ml-px inline-flex h-8 min-w-0 items-center justify-center border border-border bg-background px-4 text-sm text-foreground shadow-xs',
    'first:ml-0 first:rounded-l-md last:rounded-r-md',
    'outline-none transition-none',
    'hover:bg-muted-background',
    'focus-visible:z-10 focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
    'disabled:cursor-not-allowed disabled:opacity-50',
    'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20',
    'data-[state=checked]:z-10 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'h-7 px-3 text-xs',
        default: 'h-8 px-4 text-sm',
        lg: 'h-9 px-5 text-sm',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export type RadioGroupStyleProps = VariantProps<typeof radioGroupClassName>
export type RadioStyleProps = VariantProps<typeof radioRootClassName>
export type RadioButtonStyleProps = VariantProps<typeof radioButtonClassName>
