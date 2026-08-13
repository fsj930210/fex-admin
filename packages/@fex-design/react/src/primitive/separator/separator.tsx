import { separatorClassName } from '@fex-design/styles/separator'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'
export function Separator({
  orientation = 'horizontal',
  decorative = true,
  className,
  ...props
}: ComponentProps<'div'> & { orientation?: 'horizontal' | 'vertical'; decorative?: boolean }) {
  return (
    <div
      role={decorative ? 'none' : 'separator'}
      aria-orientation={decorative ? undefined : orientation}
      data-slot="separator"
      data-orientation={orientation}
      className={cn(separatorClassName, className)}
      {...props}
    />
  )
}
