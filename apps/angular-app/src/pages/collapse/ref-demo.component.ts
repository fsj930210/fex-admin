import { ChangeDetectionStrategy, Component } from '@angular/core'
import { ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/angular/primitive/collapse'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { collapseItems } from './demo-data'

@Component({
  selector: 'fex-ref-collapse-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [Card, Button, Collapse, CollapseItem, CollapseTrigger, CollapseContent, ChevronRightIcon],
  templateUrl: './ref-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RefCollapseDemoComponent {
  protected readonly items = collapseItems
}
