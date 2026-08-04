import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { Textarea } from '@fex-design/angular/primitive/textarea'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fexTextarea-page',
  imports: [RouterLink, Card, Textarea],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {}
