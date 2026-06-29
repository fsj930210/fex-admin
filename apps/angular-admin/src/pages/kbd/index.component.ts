import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Kbd, KbdGroup } from '@fex/components-angular/primitive/kbd'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-kbd-page',
  imports: [RouterLink, Card, Kbd, KbdGroup],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdComponent {
}
