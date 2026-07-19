import { cva, type VariantProps } from 'class-variance-authority'

export const fieldRootClassName = cva('group/field min-w-0', {
  variants: {
    orientation: {
      vertical: 'grid gap-1.5',
      horizontal: 'grid grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] items-start gap-x-4 gap-y-1.5',
      responsive: 'grid gap-1.5 md:grid-cols-[minmax(0,0.35fr)_minmax(0,1fr)] md:items-start md:gap-x-4',
    },
  },
  defaultVariants: { orientation: 'vertical' },
})

export const fieldGroupClassName = 'grid min-w-0 gap-4'
export const fieldSetClassName = 'grid min-w-0 gap-4 border-0 p-0'
export const fieldLegendClassName = 'text-sm font-semibold text-foreground'
export const fieldContentClassName = 'grid min-w-0 gap-1.5'
export const fieldLabelClassName = 'inline-flex w-fit items-center gap-1 text-sm font-medium text-foreground group-data-[disabled=true]/field:cursor-not-allowed group-data-[disabled=true]/field:opacity-60'
export const fieldTitleClassName = 'text-sm font-medium text-foreground'
export const fieldDescriptionClassName = 'text-sm leading-5 text-muted-foreground'
export const fieldErrorClassName = 'text-sm leading-5 text-danger'
export const fieldRequiredIndicatorClassName = 'text-danger'
export const fieldSeparatorClassName = 'relative h-px w-full bg-border'

export type FieldStyleProps = VariantProps<typeof fieldRootClassName>
