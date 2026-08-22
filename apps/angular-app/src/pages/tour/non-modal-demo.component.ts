import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourPanelComponent } from './tour-panel.component'
import { TourStartComponent } from './tour-start.component'
@Component({ selector: 'app-tour-non-modal-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourStep, TourContent, TourArrow, TourPanelComponent, TourStartComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './non-modal-demo.component.html' })
export class NonModalDemoComponent {}
