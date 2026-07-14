import { ChangeDetectionStrategy, Component } from '@angular/core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { dndFeature } from '@fex/components-core/tree/features/dnd'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import { ChevronDownIcon } from '@fex/components-angular/icon/chevron'
import {
  TreeItemDirective,
  TreeRoot,
  TreeTitleDirective,
  TreeTriggerDirective,
  TreeViewport,
} from '@fex/components-angular/primitive/tree'
import { TreeDndItemDirective } from '@fex/components-angular/primitive/tree/tree-dnd-item'
import Card from '@fex/components-angular/ui/card'
import {
  departmentFieldNames,
  departmentTreeData,
  isDepartmentLeaf,
  type DepartmentNode,
} from './data'

@Component({
  selector: 'fex-dnd-tree-demo',
  standalone: true,
  imports: [
    Card,
    TreeRoot,
    TreeViewport,
    TreeItemDirective,
    TreeTriggerDirective,
    TreeTitleDirective,
    TreeDndItemDirective,
    ChevronDownIcon,
  ],
  templateUrl: './dnd-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DndTreeDemoComponent {
  protected readonly controller = createTreeController<DepartmentNode>({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: isDepartmentLeaf,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
      dndFeature(),
    ],
  })
}
