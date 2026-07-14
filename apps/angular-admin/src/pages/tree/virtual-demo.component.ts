import { ChangeDetectionStrategy, Component, viewChild } from '@angular/core'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import type { TreeOptions } from '@fex/components-core/tree/types'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { createLargeTreeData, departmentFieldNames, type DepartmentNode } from './data'

@Component({
  selector: 'fex-virtual-tree-demo',
  standalone: true,
  imports: [Button, Card, DemoTreeComponent],
  templateUrl: './virtual-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VirtualTreeDemoComponent {
  protected readonly viewport = viewChild.required(DemoTreeComponent)
  protected readonly options: TreeOptions<DepartmentNode> = {
    treeData: createLargeTreeData(),
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [expansionFeature({ defaultExpandedKeys: ['large-root'] })],
  }
}
