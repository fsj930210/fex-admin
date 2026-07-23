import { NgStyle } from '@angular/common'
import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { EllipsisIcon } from '@fex/components-angular/icon/more'
import { FexSortable, FexSortableItemDirective } from '@fex/components-angular/primitive/sortable'
import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-angular/primitive/tabs'
import Card from '@fex/components-angular/ui/card'
import { initialTabs } from './data'

@Component({
  selector: 'fex-sortable-tabs-demo',
  standalone: true,
  imports: [Card, EllipsisIcon, FexSortable, FexSortableItemDirective, NgStyle, TabsRoot, TabsList, TabsItem, TabsContent],
  templateUrl: './sortable-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableTabsDemoComponent {
  protected readonly fixed = initialTabs[0]!
  protected readonly items = signal(initialTabs.slice(1))
  protected readonly ids = () => this.items().map((item) => item.value)

  protected reorder(values: string[]) {
    const byValue = new Map(this.items().map((item) => [item.value, item]))
    this.items.set(values.map((value) => byValue.get(value)).filter((item): item is NonNullable<typeof item> => Boolean(item)))
  }

  protected label(value: string | number) {
    return this.items().find((item) => item.value === String(value))?.label
  }
}
