export { default as Timeline } from './timeline-root.vue'
export { default as TimelineItem } from './timeline-item.vue'
export { default as TimelineIndicator } from './timeline-indicator.vue'
export { default as TimelineContent } from './timeline-content.vue'
export { default as TimelineOpposite } from './timeline-opposite.vue'

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
