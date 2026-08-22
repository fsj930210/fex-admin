import { ChangeDetectionStrategy, Component, inject } from '@angular/core'
import { TourRoot } from '@fex-design/angular/primitive/tour'
@Component({ selector: 'app-tour-start', standalone: true, changeDetection: ChangeDetectionStrategy.OnPush, template: '<button type="button" class="inline-flex h-9 items-center justify-center rounded-md border border-primary bg-primary px-3 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90" (click)="root.openTour()">开始引导</button>' })
export class TourStartComponent { protected readonly root = inject(TourRoot) }
