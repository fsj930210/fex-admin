import { ChangeDetectionStrategy, Component } from '@angular/core'
import { Separator } from '@fex-design/angular/primitive/separator'
import Card from '@fex-design/angular/ui/card'
@Component({
  selector: 'fex-separator-page',
  standalone: true,
  imports: [Card, Separator],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SeparatorComponent {
  protected readonly items = [
    { label: 'Workspace', value: 'Fex Admin' },
    { label: 'Plan', value: 'Team' },
    { label: 'Region', value: 'Asia Pacific' },
  ]
  protected readonly placements = ['Start', 'Center', 'End']
}
