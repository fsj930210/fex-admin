import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-max-count-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Maximum selection count" description="maxCount limits selection; maxTagCount controls presentation." [options]="options" [multiple]="true" [defaultValue]="values" [maxCount]="3" [maxTagCount]="2" />',
})
class MaxCountDemo {
  protected readonly options = frameworkOptions
  protected readonly values = ['react']
}
