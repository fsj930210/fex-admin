import { Component } from '@angular/core'
import { frameworkOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-custom-search-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Custom search" description="A custom filterOption matches labels by prefix." [options]="options" [showSearch]="true" [filterOption]="filter" />',
})
class CustomSearchDemo {
  protected readonly options = frameworkOptions
  protected readonly filter = (keyword: string, option: { label: string }) =>
    option.label.toLocaleLowerCase().startsWith(keyword.trim().toLocaleLowerCase())
}
