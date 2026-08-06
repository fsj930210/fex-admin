import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TourControl, TourRoot } from '@fex-design/angular/primitive/tour'
@Component({ selector: 'app-tour-actions', standalone: true, imports: [TourControl], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './tour-actions.component.html' })
export class TourActionsComponent { protected readonly root = inject(TourRoot) }
