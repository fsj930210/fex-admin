import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { ContextMenuItem } from '@fex-design/angular/primitive/context-menu'

@Component({
  selector: 'app-context-menu-surface',
  standalone: true,
  imports: [ContextMenuItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './menu-surface.component.html',
})
export class ContextMenuSurfaceComponent {
  @Input({ required: true }) label = ''
}
