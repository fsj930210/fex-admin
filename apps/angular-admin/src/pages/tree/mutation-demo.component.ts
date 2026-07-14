import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import { focusFeature } from '@fex/components-core/tree/features/focus'
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { TreeOptions } from '@fex/components-core/tree/types'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

@Component({
  selector: 'fex-mutation-tree-demo',
  standalone: true,
  imports: [Button, Card, DemoTreeComponent],
  templateUrl: './mutation-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MutationTreeDemoComponent {

  protected readonly data = signal<readonly DepartmentNode[]>(departmentTreeData)
  protected readonly controller = createTreeController<DepartmentNode>({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }),
      focusFeature(),
    ],
  })
  protected readonly options = computed<TreeOptions<DepartmentNode>>(() => ({
    treeData: this.data(),
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    onTreeDataChange: (next) => this.data.set(next),
  }))

  protected addChild() {
    this.controller.insertNode({
      parentKey: 'engineering',
      node: {
        id: `api-${Date.now()}`,
        name: 'New API node',
        childrenList: [],
        childCount: 0,
      },
    })
  }

  protected reveal() {
    this.controller.getFeature<FocusFeatureApi>('focus')?.reveal('design')
  }
}
