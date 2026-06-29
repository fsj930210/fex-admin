import { spinnerClassName, type SpinnerStyleProps } from '@fex/components-styles/spinner'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
import { LoadingIcon } from '../../icon/loading'

export function Spinner({
  className,
  size = 'md',
  ...props
}: ComponentProps<'span'> & SpinnerStyleProps) {
  return (
    <span data-slot="spinner" className={cn(spinnerClassName({ size }), className)} {...props}>
      <LoadingIcon />
    </span>
  )
}
