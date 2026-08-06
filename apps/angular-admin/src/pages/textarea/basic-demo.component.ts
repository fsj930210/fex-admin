import { ChangeDetectionStrategy, Component } from '@angular/core'
import { TextareaInput, TextareaRoot } from '@fex-design/angular/primitive/textarea'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-textarea-basic-demo',
  imports: [Card, TextareaRoot, TextareaInput],
  templateUrl: './basic-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaBasicDemo {}
