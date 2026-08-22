import { ChangeDetectionStrategy, Component } from '@angular/core'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuPortal,
  ContextMenuTrigger,
} from '@fex-design/angular/primitive/context-menu'
import { ContextMenuSurfaceComponent } from './menu-surface.component'

@Component({
  selector: 'app-context-menu-basic-demo',
  standalone: true,
  imports: [ContextMenu, ContextMenuTrigger, ContextMenuPortal, ContextMenuContent, ContextMenuSurfaceComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-demo.component.html',
})
export class ContextMenuBasicDemoComponent {
  protected last = 'Right click the panel'

  protected handleOpenChange(open: boolean) {
    if (open) this.last = 'Opened basic-panel'
  }
}
