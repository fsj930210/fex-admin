import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'fex-close-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './close.html',
})
export class CloseIcon {}
