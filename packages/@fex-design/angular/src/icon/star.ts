import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'fex-star-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './star.html',
})
export class StarIcon {}
