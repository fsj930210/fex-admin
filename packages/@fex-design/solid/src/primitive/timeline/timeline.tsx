import {
  timelineClassName,
  timelineContentClassName,
  timelineIndicatorClassName,
  timelineItemClassName,
  timelineOppositeClassName,
} from '@fex-design/styles/timeline'
import { cn } from '@fex/utils'
import { splitProps, type JSX, type ParentProps } from 'solid-js'

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

export interface TimelineProps extends ParentProps<JSX.OlHTMLAttributes<HTMLOListElement>> {
  orientation?: TimelineOrientation
  align?: TimelineAlign
  reverse?: boolean
}

export function Timeline(props: TimelineProps) {
  const [local, rest] = splitProps(props, ['orientation', 'align', 'reverse', 'class', 'children'])
  const orientation = () => local.orientation ?? 'vertical'
  const align = () => local.align ?? 'end'

  return (
    <ol
      {...rest}
      data-slot="timeline"
      data-orientation={orientation()}
      data-align={align()}
      data-reverse={local.reverse || undefined}
      class={cn(
        timelineClassName({ orientation: orientation(), align: align(), reverse: local.reverse }),
        local.class,
      )}
    >
      {local.children}
    </ol>
  )
}

export interface TimelineItemProps extends ParentProps<JSX.LiHTMLAttributes<HTMLLIElement>> {
  status?: TimelineStatus
  connectorStatus?: TimelineStatus
  placement?: TimelinePlacement
}

export function TimelineItem(props: TimelineItemProps) {
  const [local, rest] = splitProps(props, [
    'status',
    'connectorStatus',
    'placement',
    'class',
    'children',
  ])
  const status = () => local.status ?? 'default'

  return (
    <li
      {...rest}
      data-slot="timeline-item"
      data-status={status()}
      data-connector-status={local.connectorStatus ?? status()}
      data-placement={local.placement}
      aria-current={status() === 'current' ? 'step' : undefined}
      class={cn(timelineItemClassName, local.class)}
    >
      {local.children}
    </li>
  )
}

type TimelinePartProps = ParentProps<JSX.HTMLAttributes<HTMLElement>>

function createTimelinePart(slot: string, className: string) {
  return function TimelinePart(props: TimelinePartProps) {
    const [local, rest] = splitProps(props, ['class', 'children'])
    return (
      <div {...rest} data-slot={slot} class={cn(className, local.class)}>
        {local.children}
      </div>
    )
  }
}

export const TimelineIndicator = createTimelinePart('timeline-indicator', timelineIndicatorClassName)
export const TimelineContent = createTimelinePart('timeline-content', timelineContentClassName)
export const TimelineOpposite = createTimelinePart('timeline-opposite', timelineOppositeClassName)
