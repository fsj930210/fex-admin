import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import { focusFeature } from '@fex/components-core/tree/features/focus'
import { keyboardFeature } from '@fex/components-core/tree/features/keyboard'
import { selectionFeature } from '@fex/components-core/tree/features/selection'
import type { TreeKey, TreeOptions } from '@fex/components-core/tree/types'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

@Component({
  selector: 'fex-controlled-tree-demo',
  standalone: true,
  imports: [Button, Card, DemoTreeComponent],
  templateUrl: './controlled-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ControlledTreeDemoComponent {
  protected readonly expanded = signal<readonly TreeKey[]>(['company', 'engineering'])
  protected readonly selected = signal<readonly TreeKey[]>([])
  protected readonly options = computed<TreeOptions<DepartmentNode>>(() => ({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    expandedKeys: this.expanded(),
    onExpandedKeysChange: (keys) => this.expanded.set(keys),
    selectedKeys: this.selected(),
    onSelectedKeysChange: (keys) => this.selected.set(keys),
    features: [expansionFeature(), selectionFeature(), focusFeature(), keyboardFeature()],
  }))

  protected selectFrontend() {
    this.expanded.set(['company', 'engineering'])
    this.selected.set(['frontend'])
  }
}
