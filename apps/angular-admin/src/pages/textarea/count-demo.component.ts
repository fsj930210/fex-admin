import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TextareaInput, TextareaRoot } from '@fex-design/angular/primitive/textarea'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-textarea-count-demo',
  imports: [Card, TextareaRoot, TextareaInput],
  templateUrl: './count-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaCountDemo {
  protected value = 'Textarea count is implemented by the demo, not by the primitive.'
  protected readonly maxLength = 120
  protected readonly autoSize = { minRows: 3, maxRows: 6 }
}
