import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-multi-field-search-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Multi-field search" description="Search label, searchText and keywords." [options]="options" [showSearch]="true" [filterOption]="filter" placeholder="输入 google 或 meta" />',
})
class MultiFieldSearchDemo {
  protected readonly options = frameworkOptions
  protected readonly filter = defaultSelectFilterOption
}
