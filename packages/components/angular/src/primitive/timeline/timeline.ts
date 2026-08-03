import {
  timelineClassName,
  timelineContentClassName,
  timelineIndicatorClassName,
  timelineItemClassName,
  timelineOppositeClassName,
} from '@fex/components-styles/timeline'
import { booleanAttribute, ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'

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

@Component({
  selector: 'fex-timeline',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'timeline',
    '[attr.data-orientation]': 'orientation()',
    '[attr.data-align]': 'align()',
    '[attr.data-reverse]': 'reverse() || null',
    role: 'list',
  },
  template: '<ng-content />',
})
export class Timeline {
  orientation = input<TimelineOrientation>('vertical')
  align = input<TimelineAlign>('end')
  reverse = input(false, { transform: booleanAttribute })

  private readonly classes = computed(() =>
    timelineClassName({
      orientation: this.orientation(),
      align: this.align(),
      reverse: this.reverse(),
    }),
  )
  protected readonly hostClassName = createHostClassName(this.classes)
}

@Component({
  selector: 'fex-timeline-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'timeline-item',
    '[attr.data-status]': 'status()',
    '[attr.data-connector-status]': 'connectorStatus() ?? status()',
    '[attr.data-placement]': 'placement() ?? null',
    '[attr.aria-current]': "status() === 'current' ? 'step' : null",
    role: 'listitem',
  },
  template: '<ng-content />',
})
export class TimelineItem {
  status = input<TimelineStatus>('default')
  connectorStatus = input<TimelineStatus>()
  placement = input<TimelinePlacement>()
  protected readonly hostClassName = createHostClassName(timelineItemClassName)
}

@Component({
  selector: 'fex-timeline-indicator',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'timeline-indicator',
    'aria-hidden': 'true',
  },
  template: '<ng-content />',
})
export class TimelineIndicator {
  protected readonly hostClassName = createHostClassName(timelineIndicatorClassName)
}

@Component({
  selector: 'fex-timeline-content',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'timeline-content' },
  template: '<ng-content />',
})
export class TimelineContent {
  protected readonly hostClassName = createHostClassName(timelineContentClassName)
}

@Component({
  selector: 'fex-timeline-opposite',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { '[class]': 'hostClassName()', 'data-slot': 'timeline-opposite' },
  template: '<ng-content />',
})
export class TimelineOpposite {
  protected readonly hostClassName = createHostClassName(timelineOppositeClassName)
}
