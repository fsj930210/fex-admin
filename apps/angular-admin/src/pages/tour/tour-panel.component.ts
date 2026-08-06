import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core'
import { CloseIcon } from '@fex-design/angular/icon/close'
import { TourControl, TourRoot } from '@fex-design/angular/primitive/tour'
@Component({ selector: 'app-tour-panel', standalone: true, imports: [TourControl, CloseIcon], changeDetection: ChangeDetectionStrategy.OnPush, templateUrl: './tour-panel.component.html' })
export class TourPanelComponent {
  @Input({ required: true }) title = ''
  @Input({ required: true }) description = ''
  protected readonly root = inject(TourRoot)
  protected progress() { const snapshot = this.root.snapshot(); return snapshot.total ? ((snapshot.currentIndex + 1) / snapshot.total) * 100 : 0 }
}
