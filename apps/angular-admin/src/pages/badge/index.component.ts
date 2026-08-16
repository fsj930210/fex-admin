import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Badge, BadgeOverflow } from '@fex-design/angular/primitive/badge'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-badge-page',
  imports: [RouterLink, Card, Badge, BadgeOverflow],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BadgeComponent {
  protected readonly variants = [
    'default',
    'secondary',
    'destructive',
    'outline',
    'ghost',
    'link',
  ] as const
  protected readonly overflowItems = ['Design', 'Frontend', 'Backend', 'QA', 'Operations']
}
