import { ChangeDetectionStrategy, Component } from '@angular/core'

@Component({
  selector: 'fex-trash-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trash.html',
})
export class TrashIcon {}
