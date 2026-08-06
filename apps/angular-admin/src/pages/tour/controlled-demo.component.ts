import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourActionsComponent } from './tour-actions.component'
import { TourPanelComponent } from './tour-panel.component'
@Component({ selector: 'app-tour-controlled-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourStep, TourContent, TourArrow, TourPanelComponent, TourActionsComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './controlled-demo.component.html' })
export class ControlledDemoComponent { open = false; current = 0; openChanged(value: boolean) { this.open = value } change(value: number) { this.current = value } }
