import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Textarea } from '@fex/components-angular/primitive/textarea'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-textarea-page',
  imports: [RouterLink, Card, Textarea],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {
}
