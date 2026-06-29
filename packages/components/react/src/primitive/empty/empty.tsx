import {
  emptyClassName,
  emptyContentClassName,
  emptyDescriptionClassName,
  emptyHeaderClassName,
  emptyMediaClassName,
  emptyTitleClassName,
  type EmptyMediaStyleProps,
} from '@fex/components-styles/empty'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export function Empty({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="empty" className={cn(emptyClassName, className)} {...props} />
}

export function EmptyHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="empty-header" className={cn(emptyHeaderClassName, className)} {...props} />
}

export function EmptyMedia({
  className,
  variant = 'default',
  ...props
}: ComponentProps<'div'> & EmptyMediaStyleProps) {
  return (
    <div
      data-slot="empty-icon"
      data-variant={variant}
      className={cn(emptyMediaClassName({ variant }), className)}
      {...props}
    />
  )
}

export function EmptyTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="empty-title" className={cn(emptyTitleClassName, className)} {...props} />
}

export function EmptyDescription({ className, ...props }: ComponentProps<'p'>) {
  return (
    <p
      data-slot="empty-description"
      className={cn(emptyDescriptionClassName, className)}
      {...props}
    />
  )
}

export function EmptyContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div data-slot="empty-content" className={cn(emptyContentClassName, className)} {...props} />
  )
}
