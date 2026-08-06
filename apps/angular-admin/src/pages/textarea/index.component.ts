import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { TextareaAutosizeDemo } from './autosize-demo.component'
import { TextareaBasicDemo } from './basic-demo.component'
import { TextareaControlledDemo } from './controlled-demo.component'
import { TextareaCountDemo } from './count-demo.component'
import { TextareaFooterDemo } from './footer-demo.component'

@Component({
  selector: 'fexTextarea-page',
  imports: [
    RouterLink,
    TextareaBasicDemo,
    TextareaAutosizeDemo,
    TextareaControlledDemo,
    TextareaCountDemo,
    TextareaFooterDemo,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextareaComponent {}
