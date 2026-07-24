import { Component } from '@angular/core'
import { virtualOptions } from './data'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-virtual-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Virtual scrolling" description="Only visible options mount from 1,000 entries." [options]="options" [showSearch]="true" [virtual]="virtual" />',
})
class VirtualDemo {
  protected readonly options = virtualOptions
  protected readonly virtual = { itemHeight: 32, overscan: 4 }
}
