import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CheckIcon } from '@fex/components-angular/icon/check'
import { ClockIcon } from '@fex/components-angular/icon/clock'
import {
  Timeline,
  TimelineContent,
  TimelineIndicator,
  TimelineItem,
  TimelineOpposite,
} from '@fex/components-angular/primitive/timeline'
import { Badge } from '@fex/components-angular/ui/badge'
import { Card } from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-timeline-custom-node-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [
    Card,
    Badge,
    CheckIcon,
    ClockIcon,
    Timeline,
    TimelineItem,
    TimelineIndicator,
    TimelineContent,
    TimelineOpposite,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-node-demo.component.html',
})
export class CustomNodeDemoComponent {}
