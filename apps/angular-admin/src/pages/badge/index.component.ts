import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Badge } from '@fex/components-angular/ui/badge'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-badge-page',
  imports: [RouterLink, Card, Badge],
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
}
