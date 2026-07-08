import { cva, type VariantProps } from 'class-variance-authority'

export const checkboxRootClassName = [
  'peer inline-flex shrink-0 items-center justify-center rounded-[min(var(--radius-md),4px)] border border-border bg-background text-current shadow-xs',
  'outline-none transition-none',
  'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
  'disabled:cursor-not-allowed disabled:opacity-50',
  'aria-invalid:border-danger aria-invalid:ring-3 aria-invalid:ring-danger/20',
  'data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground',
  'data-[state=indeterminate]:border-primary data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-primary-foreground',
].join(' ')

export const checkboxClassName = cva(
  [
    checkboxRootClassName,
    '[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*=size-])]:size-3',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'size-3.5',
        default: 'size-4',
        lg: 'size-5 [&_svg]:size-3.5',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const checkboxIndicatorClassName =
  'group/checkbox-indicator flex items-center justify-center text-current transition-none'

export const checkboxCheckIconClassName = 'block group-data-[state=indeterminate]/checkbox-indicator:hidden'

export const checkboxMinusIconClassName = 'hidden group-data-[state=indeterminate]/checkbox-indicator:block'

export const checkboxGroupClassName = cva('grid min-w-0 gap-2', {
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

export type CheckboxStyleProps = VariantProps<typeof checkboxClassName>
export type CheckboxGroupStyleProps = VariantProps<typeof checkboxGroupClassName>
