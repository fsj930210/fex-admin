import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import { searchFeature, type SearchFeatureApi } from '@fex/components-core/tree/features/search'
import type { TreeOptions } from '@fex/components-core/tree/types'
import { Input } from '@fex/components-angular/primitive/input'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

@Component({
  selector: 'fex-search-tree-demo',
  standalone: true,
  imports: [Card, Input, DemoTreeComponent],
  templateUrl: './search-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchTreeDemoComponent {
  protected readonly keyword = signal('')
  protected readonly controller = createTreeController<DepartmentNode>({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
      searchFeature(),
    ],
  })
  protected readonly baseOptions: TreeOptions<DepartmentNode> = {
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] })],
  }
  protected readonly subtree = computed(
    () =>
      this.controller.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({
        keyword: this.keyword(),
        filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()),
      }) ?? [],
  )
  protected readonly searchOptions = computed<TreeOptions<DepartmentNode>>(() => ({
    ...this.baseOptions,
    treeData: this.subtree(),
  }))
  protected readonly showing = computed(() => Boolean(this.keyword().trim()))
}
