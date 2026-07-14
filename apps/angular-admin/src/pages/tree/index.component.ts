import { ChangeDetectionStrategy, Component } from '@angular/core'
import { RouterLink } from '@angular/router'
import { AsyncTreeDemoComponent } from './async-demo.component'
import { BasicTreeDemoComponent } from './basic-demo.component'
import { BatchActionsTreeDemoComponent } from './batch-actions-demo.component'
import { CheckTreeDemoComponent } from './check-demo.component'
import { ControlledTreeDemoComponent } from './controlled-demo.component'
import { DndTreeDemoComponent } from './dnd-demo.component'
import { MutationTreeDemoComponent } from './mutation-demo.component'
import { SearchTreeDemoComponent } from './search-demo.component'
import { VirtualTreeDemoComponent } from './virtual-demo.component'

@Component({
  selector: 'fex-tree-page',
  standalone: true,
  imports: [
    RouterLink,
    BasicTreeDemoComponent,
    ControlledTreeDemoComponent,
    BatchActionsTreeDemoComponent,
    MutationTreeDemoComponent,
    DndTreeDemoComponent,
    CheckTreeDemoComponent,
    AsyncTreeDemoComponent,
    SearchTreeDemoComponent,
    VirtualTreeDemoComponent,
  ],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeComponent {}
