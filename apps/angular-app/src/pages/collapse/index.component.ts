import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AccordionCollapseDemoComponent } from './accordion-demo.component'
import { BasicCollapseDemoComponent } from './basic-demo.component'
import { ControlledCollapseDemoComponent } from './controlled-demo.component'
import { CustomCollapseDemoComponent } from './custom-demo.component'
import { NestedCollapseDemoComponent } from './nested-demo.component'
import { RefCollapseDemoComponent } from './ref-demo.component'
import { VariantCollapseDemoComponent } from './variant-demo.component'

@Component({
  selector: 'fex-collapse-page',
  standalone: true,
  imports: [
    RouterLink,
    BasicCollapseDemoComponent,
    AccordionCollapseDemoComponent,
    ControlledCollapseDemoComponent,
    RefCollapseDemoComponent,
    CustomCollapseDemoComponent,
    VariantCollapseDemoComponent,
    NestedCollapseDemoComponent,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CollapseComponent {}
