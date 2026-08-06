import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex-design/angular/ui/card'
import { ActionsDemoComponent } from './actions-demo.component'
import { BasicDemoComponent } from './basic-demo.component'
import { ControlledDemoComponent } from './controlled-demo.component'
import { GapDemoComponent } from './gap-demo.component'
import { IndicatorDemoComponent } from './indicator-demo.component'
import { MaskDemoComponent } from './mask-demo.component'
import { NonModalDemoComponent } from './non-modal-demo.component'
import { PlacementDemoComponent } from './placement-demo.component'
@Component({ selector: 'fex-tour-page', standalone: true, imports: [RouterLink, Card, BasicDemoComponent, ControlledDemoComponent, ActionsDemoComponent, GapDemoComponent, IndicatorDemoComponent, MaskDemoComponent, NonModalDemoComponent, PlacementDemoComponent], host: { class: 'block' }, changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './index.component.html' })
export class TourComponent {}
