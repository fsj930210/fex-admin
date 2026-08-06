import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourIndicatorsComponent } from './tour-indicators.component'
import { TourNavigationComponent } from './tour-navigation.component'
import { TourPanelComponent } from './tour-panel.component'
import { TourStartComponent } from './tour-start.component'
@Component({ selector: 'app-tour-indicator-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourStep, TourContent, TourArrow, TourPanelComponent, TourIndicatorsComponent, TourNavigationComponent, TourStartComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './indicator-demo.component.html' })
export class IndicatorDemoComponent {}
