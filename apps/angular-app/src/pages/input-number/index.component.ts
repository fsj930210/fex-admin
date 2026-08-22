import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { BasicDemoComponent } from './basic-demo.component'
import { ConstraintsDemoComponent } from './constraints-demo.component'
import { CustomLogicDemoComponent } from './custom-logic-demo.component'
import { FormatterDemoComponent } from './formatter-demo.component'
import { KeyboardDemoComponent } from './keyboard-demo.component'
import { MinMaxDemoComponent } from './min-max-demo.component'
import { StatesDemoComponent } from './states-demo.component'
import { SuffixDemoComponent } from './suffix-demo.component'
import { ValidationDemoComponent } from './validation-demo.component'
@Component({
  selector: 'fex-input-number-page',
  standalone: true,
  imports: [
    RouterLink,
    BasicDemoComponent,
    ConstraintsDemoComponent,
    CustomLogicDemoComponent,
    FormatterDemoComponent,
    KeyboardDemoComponent,
    MinMaxDemoComponent,
    StatesDemoComponent,
    SuffixDemoComponent,
    ValidationDemoComponent,
  ],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
export class InputNumberPage {}
