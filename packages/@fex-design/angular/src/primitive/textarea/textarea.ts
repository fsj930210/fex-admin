import { textareaClassName as textareaStyleClassName } from '@fex-design/styles/textarea'
import { Directive } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'

@Directive({
  selector: 'textarea[fexTextarea]',
  standalone: true,
  host: { '[class]': 'hostClassName()', 'data-slot': 'textarea' },
})
export class Textarea {
  protected readonly hostClassName = createHostClassName(textareaStyleClassName)
}
