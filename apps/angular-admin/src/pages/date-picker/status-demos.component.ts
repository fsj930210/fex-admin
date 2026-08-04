import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldRoot,
} from '@fex-design/angular/primitive/field'
import { Card } from '@fex-design/angular/ui/card'
import { DemoDatePicker, DemoRangePicker } from './demo-date-picker.component'

@Component({
  selector: 'demo-status-demos',
  standalone: true,
  imports: [
    Card,
    FieldRoot,
    FieldLabel,
    FieldDescription,
    FieldError,
    DemoDatePicker,
    DemoRangePicker,
  ],
  templateUrl: './status-demos.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusDemos {}
