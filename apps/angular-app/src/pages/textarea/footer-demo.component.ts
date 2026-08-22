import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  TextareaClear,
  TextareaFooter,
  TextareaInput,
  TextareaRoot,
} from '@fex-design/angular/primitive/textarea'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { CheckIcon } from '@fex-design/angular/icon/check'
import { InfoIcon } from '@fex-design/angular/icon/info'
import { PlusIcon } from '@fex-design/angular/icon/plus'

@Component({
  selector: 'fex-textarea-footer-demo',
  imports: [
    Card,
    Button,
    TextareaRoot,
    TextareaInput,
    TextareaClear,
    TextareaFooter,
    CheckIcon,
    InfoIcon,
    PlusIcon,
  ],
  templateUrl: './footer-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaFooterDemo {
  protected value = ''
  protected readonly autoSize = { minRows: 1, maxRows: 8 }
}
