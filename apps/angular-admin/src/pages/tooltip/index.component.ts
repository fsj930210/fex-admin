import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex/components-angular/ui/card'
import { TooltipBasicDemo } from './basic-demo.component'
import { TooltipControlledDemo } from './controlled-demo.component'
import { TooltipDisabledDemo } from './disabled-demo.component'
import { TooltipPlacementDemo } from './placement-demo.component'
import { TooltipStyleDemo } from './style-demo.component'
@Component({ selector: 'fex-tooltip-page', standalone: true, imports: [RouterLink, Card, TooltipBasicDemo, TooltipControlledDemo, TooltipDisabledDemo, TooltipPlacementDemo, TooltipStyleDemo], host: { class: 'block' }, changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './index.component.html' })
export class TooltipComponent {}
