import { ChangeDetectionStrategy, Component } from '@angular/core'
import { expansionFeature } from '@fex-design/core/tree/features/expansion'
import type { TreeOptions } from '@fex-design/core/tree/types'
import Card from '@fex-design/angular/ui/card'
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
