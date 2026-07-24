import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-single-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Single" description="Single selection closes the panel after choosing an option." [options]="options" defaultValue="react" />',
})
class SingleDemo {
  protected readonly options = frameworkOptions
}
