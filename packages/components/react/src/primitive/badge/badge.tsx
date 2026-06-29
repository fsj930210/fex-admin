import { badgeClassName, type BadgeStyleProps } from '@fex/components-styles/badge'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export function Badge({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'span'> & BadgeStyleProps) {
  return (
    <span
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeClassName({ variant }), className)}
      {...props}
    />
  )
}
