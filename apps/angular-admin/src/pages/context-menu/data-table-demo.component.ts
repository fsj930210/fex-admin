import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '@fex-design/angular/primitive/context-menu'
import { ContextMenuSurfaceComponent } from './menu-surface.component'

@Component({
  selector: 'app-context-menu-data-table-demo',
  standalone: true,
  imports: [ContextMenu, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-table-demo.component.html',
})
export class ContextMenuDataTableDemoComponent {
  protected readonly columns = ['Name', 'Department', 'Status', 'Progress']
  protected readonly rows = [
    ['Ada Lovelace', 'Platform', 'Active', '82%'],
    ['Grace Hopper', 'Components', 'Active', '91%'],
    ['Katherine Johnson', 'Docs', 'Paused', '64%'],
  ]
  protected label = 'Row actions'

  protected handleOpenChange(open: boolean) {
    if (open) this.label = 'Context actions'
  }
}
