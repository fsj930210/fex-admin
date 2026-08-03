import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Timeline, TimelineContent, TimelineIndicator, TimelineItem, TimelineOpposite } from '@fex/components-angular/primitive/timeline'
import { Card } from '@fex/components-angular/ui/card'
@Component({selector:'fex-timeline-basic-demo',standalone:true,imports:[Card,Timeline,TimelineItem,TimelineIndicator,TimelineContent,TimelineOpposite],changeDetection:ChangeDetectionStrategy.OnPush,host:{class:'block'},templateUrl:'./basic-demo.component.html'}) export class BasicDemoComponent {}
