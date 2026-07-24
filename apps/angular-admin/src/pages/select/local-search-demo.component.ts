import { defaultSelectFilterOption } from '@fex/components-core/select/filter-options'
import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-local-search-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Local search" description="filterOption filters locally and search receives every keyword." [options]="options" [showSearch]="true" [filterOption]="filter" />',
})
class LocalSearchDemo {
  protected readonly options = frameworkOptions
  protected readonly filter = defaultSelectFilterOption
}
