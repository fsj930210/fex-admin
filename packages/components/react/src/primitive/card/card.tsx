import {
  cardActionClassName,
  cardClassName,
  cardContentClassName,
  cardDescriptionClassName,
  cardFooterClassName,
  cardHeaderClassName,
  cardTitleClassName,
} from '@fex/components-styles/card'
import { cn } from '@fex/utils'
import { type ComponentProps } from 'react'

function Card({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card" className={cn(cardClassName(), className)} {...props} />
}
function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-header" className={cn(cardHeaderClassName(), className)} {...props} />
}
function CardTitle({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-title" className={cn(cardTitleClassName(), className)} {...props} />
}
function CardDescription({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-description" className={cn(cardDescriptionClassName(), className)} {...props} />
}
function CardAction({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-action" className={cn(cardActionClassName(), className)} {...props} />
}
function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-content" className={cn(cardContentClassName(), className)} {...props} />
}
function CardFooter({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="card-footer" className={cn(cardFooterClassName(), className)} {...props} />
}
export { Card, CardHeader, CardFooter, CardTitle, CardAction, CardDescription, CardContent }
