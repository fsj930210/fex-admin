import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TextareaClear,
  TextareaInput,
  TextareaRoot,
} from '@fex-design/angular/primitive/textarea'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-textarea-controlled-demo',
  imports: [Card, TextareaRoot, TextareaInput, TextareaClear],
  templateUrl: './controlled-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaControlledDemo {
  protected value = 'Controlled textarea value'
  protected readonly autoSize = { minRows: 2, maxRows: 5 }
}
