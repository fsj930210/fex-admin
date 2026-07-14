import { ChangeDetectionStrategy, Component } from '@angular/core'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import type { TreeOptions } from '@fex/components-core/tree/types'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

@Component({
  selector: 'fex-basic-tree-demo',
  standalone: true,
  imports: [Card, DemoTreeComponent],
  templateUrl: './basic-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BasicTreeDemoComponent {
  protected readonly options: TreeOptions<DepartmentNode> = {
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [expansionFeature({ defaultExpandedKeys: ['company'] })],
  }
}
