import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TourControl, TourRoot } from '@fex-design/angular/primitive/tour'
@Component({ selector: 'app-tour-navigation', standalone: true, imports: [TourControl], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './tour-navigation.component.html' })
export class TourNavigationComponent { protected readonly root = inject(TourRoot) }
