import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/angular/primitive/collapse'
import Card from '@fex-design/angular/ui/card'
import { collapseText } from './demo-data'

@Component({
  selector: 'fex-nested-collapse-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [Card, Collapse, CollapseItem, CollapseTrigger, CollapseContent, ChevronRightIcon],
  templateUrl: './nested-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NestedCollapseDemoComponent {
  protected readonly text = collapseText
}
