import { ChangeDetectionStrategy, Component } from '@angular/core'
import { createTreeController } from '@fex-design/core/tree/create-tree-controller'
import { dndFeature } from '@fex-design/core/tree/features/dnd'
import { expansionFeature } from '@fex-design/core/tree/features/expansion'
import { ChevronDownIcon } from '@fex-design/angular/icon/chevron'
import {
  TreeItemDirective,
  TreeRoot,
  TreeTitleDirective,
  TreeTriggerDirective,
  TreeViewport,
} from '@fex-design/angular/primitive/tree'
import { TreeDndItemDirective } from '@fex-design/angular/primitive/tree/tree-dnd-item'
import Card from '@fex-design/angular/ui/card'
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
