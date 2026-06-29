import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Spinner } from '@fex/components-angular/primitive/spinner'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-spinner-page',
  imports: [RouterLink, Card, Spinner],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SpinnerComponent {
  protected readonly sizes = ['sm', 'md', 'lg'] as const
}
