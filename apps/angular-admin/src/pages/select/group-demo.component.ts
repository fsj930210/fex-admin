import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-group-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Group" description="Options sharing a group render below a label." [options]="options" />',
})
class GroupDemo {
  protected readonly options = frameworkOptions
}
