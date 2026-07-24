import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-tags-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Tags" description="Type a new value and press Enter." [options]="options" mode="tags" [defaultValue]="values" [filterOption]="filter" />',
})
class TagsDemo {
  protected readonly options = frameworkOptions
  protected readonly values = ['react']
  protected readonly filter = defaultSelectFilterOption
}
