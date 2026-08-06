import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { TourRoot } from '@fex-design/angular/primitive/tour'
@Component({ selector: 'app-tour-indicators', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './tour-indicators.component.html' })
export class TourIndicatorsComponent { @Input({ required: true }) count = 0; protected readonly root = inject(TourRoot); protected indexes() { return Array.from({ length: this.count }, (_, index) => index) } }
