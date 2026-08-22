import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { SwitchRoot, SwitchThumb } from '@fex-design/angular/primitive/switch'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-switch-page',
  standalone: true,
  imports: [RouterLink, SwitchRoot, SwitchThumb, Card],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SwitchComponent {
  protected readonly checked = signal(true)
}
