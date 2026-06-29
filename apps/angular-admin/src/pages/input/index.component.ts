import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Input } from '@fex/components-angular/primitive/input'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-input-page',
  imports: [RouterLink, Card, Input],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InputComponent {
}
