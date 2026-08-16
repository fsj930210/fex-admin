import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { badgeClassName, badgeOverflowClassName, type BadgeStyleProps } from '@fex-design/styles/badge'
import { cn } from '@fex/utils'
import { Children, type ComponentProps, type ReactNode } from 'react'

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

export interface BadgeOverflowProps extends ComponentProps<'div'> {
  maxCount?: number | undefined
  renderOverflow?: ((overflowCount: number, overflowItems: readonly ReactNode[]) => ReactNode) | undefined
}

export function BadgeOverflow({
  maxCount,
  renderOverflow,
  className,
  children,
  ...props
}: BadgeOverflowProps) {
  const { visibleItems, overflowItems, overflowCount } = splitOverflowItems(
    Children.toArray(children),
    maxCount,
  )
  return (
    <div {...props} data-slot="badge-overflow" className={cn(badgeOverflowClassName, className)}>
      {visibleItems}
      {overflowCount > 0 && (renderOverflow?.(overflowCount, overflowItems) ?? (
        <Badge variant="secondary">+{overflowCount}</Badge>
      ))}
    </div>
  )
}
