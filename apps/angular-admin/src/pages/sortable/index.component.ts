import { ChangeDetectionStrategy, Component } from '@angular/core'
import { NgStyle } from '@angular/common'
import { RouterLink } from '@angular/router'
import {
  FexSortableContainerDirective,
  FexSortableItemDirective,
  FexSortableRegionDirective,
} from '@fex/components-angular/directives/sortable'
import Card from '@fex/components-angular/ui/card'

@Component({
  selector: 'fex-sortable-page',
  imports: [RouterLink, NgStyle, Card, FexSortableContainerDirective, FexSortableRegionDirective, FexSortableItemDirective],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SortableComponent {
  protected tasks = ['Backlog', 'Design', 'Build', 'Review']
  protected panels = {
    source: ['Name', 'Role', 'Email'],
    target: ['Status', 'Created at'],
  }
  protected columns = ['name', 'role', 'email', 'status']
  protected rows = [
    { name: 'Alice Johnson', role: 'Engineer', email: 'alice@example.com', status: 'Active' },
    { name: 'Bob Smith', role: 'Designer', email: 'bob@example.com', status: 'Active' },
    { name: 'Charlie Brown', role: 'Manager', email: 'charlie@example.com', status: 'Away' },
  ]
  protected columnLabels: Record<string, string> = {
    name: 'Name',
    role: 'Role',
    email: 'Email',
    status: 'Status',
  }
  protected get panelEntries() {
    return Object.entries(this.panels)
  }

  protected getCellValue(row: (typeof this.rows)[number], column: string) {
    return row[column as keyof typeof row]
  }

  protected panelItems(previewItems: typeof this.panels, containerId: string) {
    return previewItems[containerId as keyof typeof this.panels] ?? []
  }

  protected tableOverlayStyle(style: Record<string, string | number | null | undefined>) {
    return { ...style, height: 'auto' }
  }

  protected setPanels(items: typeof this.panels) {
    this.panels = items
  }
}
