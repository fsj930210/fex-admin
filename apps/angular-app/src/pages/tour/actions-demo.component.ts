import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TourArrow, TourContent, TourControl, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourPanelComponent } from './tour-panel.component'
import { TourStartComponent } from './tour-start.component'
@Component({ selector: 'app-tour-actions-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourStep, TourContent, TourArrow, TourControl, TourPanelComponent, TourStartComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './actions-demo.component.html' })
export class ActionsDemoComponent {}
