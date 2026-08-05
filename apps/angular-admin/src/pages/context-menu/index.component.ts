import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import Card from '@fex-design/angular/ui/card'
import { ContextMenuBasicDemoComponent } from './basic-demo.component'
import { ContextMenuDataTableDemoComponent } from './data-table-demo.component'
import { ContextMenuTreeDemoComponent } from './tree-demo.component'

@Component({
  selector: 'app-context-menu-page',
  standalone: true,
  imports: [
    RouterLink,
    Card,
    ContextMenuBasicDemoComponent,
    ContextMenuTreeDemoComponent,
    ContextMenuDataTableDemoComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './index.component.html',
})
export class ContextMenuComponent {}
