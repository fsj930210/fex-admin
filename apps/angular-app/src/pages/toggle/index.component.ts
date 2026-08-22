import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Toggle, ToggleGroup } from '@fex-design/angular/primitive/toggle'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-toggle-page', standalone: true, imports: [RouterLink, Toggle, ToggleGroup, Card], host: { class: 'block' }, templateUrl: './index.component.html', changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToggleComponent {
  protected readonly pressed = signal(false)
  protected readonly alignment = signal('left')
  protected readonly formats = signal<string[]>(['bold'])
  protected setSingle(value: string | string[]) { this.alignment.set(value as string) }
  protected setMultiple(value: string | string[]) { this.formats.set(value as string[]) }
}
