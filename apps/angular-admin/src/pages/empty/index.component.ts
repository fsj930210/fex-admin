import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from '@fex/components-angular/primitive/empty'
import { Badge } from '@fex/components-angular/primitive/badge'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-empty-page',
  imports: [RouterLink, Card, Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle, Badge],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyComponent {
}
