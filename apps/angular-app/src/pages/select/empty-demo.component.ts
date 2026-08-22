import { Component } from '@angular/core'
import { SimpleSelectDemo } from './simple-demo.component'
export
@Component({
  selector: 'fex-select-empty-demo',
  standalone: true,
  imports: [SimpleSelectDemo],
  template:
    '<fex-select-simple-demo title="Empty" description="An explicit empty state is rendered." [options]="[]" />',
})
class EmptyDemo {}
