import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import type { ExpansionKey } from '@fex-design/core/expansion/types'
import { ChevronRightIcon } from '@fex-design/angular/icon/chevron'
import { Collapse, CollapseContent, CollapseItem, CollapseTrigger } from '@fex-design/angular/primitive/collapse'
import { Button } from '@fex-design/angular/ui/button'
import Card from '@fex-design/angular/ui/card'
import { collapseItems } from './demo-data'

@Component({
  selector: 'fex-controlled-collapse-demo',
  standalone: true,
  host: { class: 'block' },
  imports: [Card, Button, Collapse, CollapseItem, CollapseTrigger, CollapseContent, ChevronRightIcon],
  templateUrl: './controlled-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlledCollapseDemoComponent {
  protected readonly items = collapseItems
  protected readonly expandedKeys = signal<ExpansionKey[]>(['billing'])
}
