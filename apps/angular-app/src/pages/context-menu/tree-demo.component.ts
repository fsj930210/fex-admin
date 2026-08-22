import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '@fex-design/angular/primitive/context-menu'
import { ContextMenuSurfaceComponent } from './menu-surface.component'

@Component({
  selector: 'app-context-menu-tree-demo',
  standalone: true,
  imports: [ContextMenu, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './tree-demo.component.html',
})
export class ContextMenuTreeDemoComponent {
  protected readonly nodes = [
    { id: 'company', name: 'Fex Design', level: 0 },
    { id: 'platform', name: 'Platform team', level: 1 },
    { id: 'components', name: 'Components team', level: 1 },
    { id: 'docs', name: 'Docs team', level: 1 },
  ]
}
