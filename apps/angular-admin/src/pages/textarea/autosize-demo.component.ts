import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TextareaInput, TextareaRoot } from '@fex-design/angular/primitive/textarea'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-textarea-autosize-demo',
  imports: [Card, TextareaRoot, TextareaInput],
  templateUrl: './autosize-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaAutosizeDemo {
  protected readonly autoSize = { minRows: 1, maxRows: 4 }
  protected readonly defaultValue =
    'Line one starts at the minimum height.\nLine two expands the textarea.\nLine three keeps growing.\nLine four reaches the configured maxRows.\nLine five now scrolls inside.'
}
