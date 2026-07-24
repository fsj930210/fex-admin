import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-multiple-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Multiple" description="Multiple selection keeps the panel open." [options]="options" [multiple]="true" [defaultValue]="values" [maxTagCount]="3" />',
})
class MultipleDemo {
  protected readonly options = frameworkOptions
  protected readonly values = ['react', 'vue']
}
