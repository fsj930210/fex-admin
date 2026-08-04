import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import type { CollapseVariant } from '@fex-design/angular/primitive/collapse'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/angular/primitive/collapse'
import Card from '@fex-design/angular/ui/card'
import { collapseText } from './demo-data'

@Component({
  selector: 'fex-variant-collapse-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [Card, Collapse, CollapseItem, CollapseTrigger, CollapseContent, ChevronRightIcon],
  templateUrl: './variant-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantCollapseDemoComponent {
  protected readonly variants: CollapseVariant[] = ['outlined', 'filled', 'ghost']
  protected readonly text = collapseText
}
