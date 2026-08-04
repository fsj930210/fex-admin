import {
  timelineClassName,
  timelineContentClassName,
  timelineIndicatorClassName,
  timelineItemClassName,
  timelineOppositeClassName,
} from '@fex-design/styles/timeline'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export type TimelineOrientation = 'vertical' | 'horizontal'
export type TimelineAlign = 'start' | 'end' | 'alternate'
export type TimelinePlacement = 'start' | 'end'
export type TimelineBuiltinStatus =
  | 'default'
  | 'completed'
  | 'current'
  | 'pending'
  | 'error'
  | 'disabled'
export type TimelineStatus = TimelineBuiltinStatus | (string & {})

export interface TimelineProps extends Omit<ComponentProps<'ol'>, 'children'> {
  orientation?: TimelineOrientation
  align?: TimelineAlign
  reverse?: boolean
  children?: ComponentProps<'ol'>['children']
}

export function Timeline({
  orientation = 'vertical',
  align = 'end',
  reverse = false,
  className,
  children,
  ...props
}: TimelineProps) {
  return (
    <ol
      {...props}
      data-slot="timeline"
      data-orientation={orientation}
      data-align={align}
      data-reverse={reverse || undefined}
      className={cn(timelineClassName({ orientation, align, reverse }), className)}
    >
      {children}
    </ol>
  )
}

export interface TimelineItemProps extends ComponentProps<'li'> {
  status?: TimelineStatus
  connectorStatus?: TimelineStatus
  placement?: TimelinePlacement
}

export function TimelineItem({
  status = 'default',
  connectorStatus,
  placement,
  className,
  ...props
}: TimelineItemProps) {
  return (
    <li
      {...props}
      data-slot="timeline-item"
      data-status={status}
      data-connector-status={connectorStatus ?? status}
      data-placement={placement}
      aria-current={status === 'current' ? 'step' : undefined}
      className={cn(timelineItemClassName, className)}
    />
  )
}

export function TimelineIndicator({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span
      aria-hidden="true"
      {...props}
      data-slot="timeline-indicator"
      className={cn(timelineIndicatorClassName, className)}
    />
  )
}

export function TimelineContent({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="timeline-content"
      className={cn(timelineContentClassName, className)}
    />
  )
}

export function TimelineOpposite({ className, ...props }: ComponentProps<'div'>) {
  return (
    <div
      {...props}
      data-slot="timeline-opposite"
      className={cn(timelineOppositeClassName, className)}
    />
  )
}
