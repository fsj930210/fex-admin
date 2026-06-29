import { cva, type VariantProps } from 'class-variance-authority'

export const spinnerClassName = cva('inline-block shrink-0 animate-spin text-current', {
  variants: {
    size: {
      sm: 'size-3',
      md: 'size-4',
      lg: 'size-5',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export type SpinnerStyleProps = VariantProps<typeof spinnerClassName>
