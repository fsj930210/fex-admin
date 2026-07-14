import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { checkFeature } from '@fex/components-core/tree/features/check'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import type { TreeKey, TreeOptions } from '@fex/components-core/tree/types'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

@Component({
  selector: 'fex-check-tree-demo',
  standalone: true,
  imports: [Card, DemoTreeComponent],
  templateUrl: './check-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CheckTreeDemoComponent {
  protected readonly cascade = signal<readonly TreeKey[]>([])
  protected readonly strict = signal<readonly TreeKey[]>([])
  protected readonly cascadeOptions = computed<TreeOptions<DepartmentNode>>(() => ({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }),
      checkFeature(),
    ],
    checkedKeys: this.cascade(),
    onCheckedKeysChange: (keys) => this.cascade.set(keys),
  }))
  protected readonly strictOptions = computed<TreeOptions<DepartmentNode>>(() => ({
    treeData: departmentTreeData,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [
      expansionFeature({ defaultExpandedKeys: ['company', 'engineering'] }),
      checkFeature({ mode: 'strict' }),
    ],
    checkedKeys: this.strict(),
    onCheckedKeysChange: (keys) => this.strict.set(keys),
  }))
}
