import {
  alertActionClassName,
  alertClassName,
  alertDescriptionClassName,
  alertTitleClassName,
  type AlertStyleProps,
} from '@fex/components-styles/alert'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export function Alert({ className, variant, ...props }: ComponentProps<'div'> & AlertStyleProps) {
  return (
    <div
      data-slot="alert"
      role="alert"
      className={cn(alertClassName({ variant }), className)}
      {...props}
    />
  )
}

export function AlertTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-title" className={cn(alertTitleClassName, className)} {...props} />
}

export function AlertDescription({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      data-slot="alert-description"
      className={cn(alertDescriptionClassName, className)}
      {...props}
    />
  )
}

export function AlertAction({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="alert-action" className={cn(alertActionClassName, className)} {...props} />
}
