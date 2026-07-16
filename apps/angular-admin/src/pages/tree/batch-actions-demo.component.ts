import { ChangeDetectionStrategy, Component } from '@angular/core'
import { checkFeature, type CheckFeatureApi } from '@fex/components-core/tree/features/check'
import {
  expansionFeature,
  type ExpansionFeatureApi,
} from '@fex/components-core/tree/features/expansion'
import {
  selectionFeature,
  type SelectionFeatureApi,
} from '@fex/components-core/tree/features/selection'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { TreeOptions } from '@fex/components-core/tree/types'
import { Button } from '@fex/components-angular/ui/button'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

@Component({
  selector: 'fex-batch-tree-demo',
  standalone: true,
  imports: [Button, Card, DemoTreeComponent],
  templateUrl: './batch-actions-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BatchActionsTreeDemoComponent {
  protected readonly options: TreeOptions<DepartmentNode> = {
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
  }
  protected readonly controller = createTreeController<DepartmentNode>({
    ...this.options,
    features: [expansionFeature(), selectionFeature({ multiple: true }), checkFeature()],
  })
  protected readonly expansion = () => this.controller.getFeature<ExpansionFeatureApi>('expansion')
  protected readonly selection = () => this.controller.getFeature<SelectionFeatureApi>('selection')
  protected readonly check = () => this.controller.getFeature<CheckFeatureApi>('check')
}
