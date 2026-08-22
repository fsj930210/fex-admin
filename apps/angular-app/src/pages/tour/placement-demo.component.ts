import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TourArrow, TourContent, TourOverlay, TourPortal, TourRoot, TourStep, TourTarget } from '@fex-design/angular/primitive/tour'
import { TourNavigationComponent } from './tour-navigation.component'
import { TourPanelComponent } from './tour-panel.component'
import { TourStartComponent } from './tour-start.component'
@Component({ selector: 'app-tour-placement-demo', standalone: true, imports: [TourRoot, TourTarget, TourPortal, TourOverlay, TourStep, TourContent, TourArrow, TourPanelComponent, TourNavigationComponent, TourStartComponent], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './placement-demo.component.html' })
export class PlacementDemoComponent { protected readonly placements = ['top', 'topLeft', 'topRight', 'right', 'rightTop', 'rightBottom', 'bottom', 'bottomLeft', 'bottomRight', 'left', 'leftTop', 'leftBottom'] as const }
