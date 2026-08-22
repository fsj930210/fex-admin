import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourActionsComponent } from './tour-actions.component'
import { TourPanelComponent } from './tour-panel.component'
import { TourStartComponent } from './tour-start.component'
@Component({ selector: 'app-tour-basic-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourStep, TourContent, TourArrow, TourPanelComponent, TourActionsComponent, TourStartComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './basic-demo.component.html' })
export class BasicDemoComponent {}
