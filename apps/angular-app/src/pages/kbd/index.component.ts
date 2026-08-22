import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Kbd, KbdGroup } from '@fex-design/angular/ui/kbd'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fexKbd-page',
  imports: [RouterLink, Card, Kbd, KbdGroup],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KbdComponent {}
