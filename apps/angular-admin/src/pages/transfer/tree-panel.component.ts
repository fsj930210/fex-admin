import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core'
import { checkFeature } from '@fex/components-core/tree/features/check'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import type { TreeOptions } from '@fex/components-core/tree/types'
import type { TransferPanelApi } from '@fex/components-angular/primitive/transfer'
import { DemoTreeComponent } from '../tree/demo-tree.component'
import type { DepartmentNode } from '../tree/data'
import type { TransferMember } from './data'

@Component({
  selector: 'fex-transfer-tree-panel',
  standalone: true,
  imports: [DemoTreeComponent],
  template: '<fex-demo-tree [options]="options()" [checkable]="true" />',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferTreePanelComponent {
  readonly panel = input.required<TransferPanelApi<TransferMember>>()
  protected readonly options = computed<TreeOptions<DepartmentNode>>(() => {
    const panel = this.panel()
    const departments = [...new Set(panel.items.map((item) => item.department))]
    const treeData: DepartmentNode[] = departments.map((department) => ({
      id: `department:${department}`,
      name: department,
      childCount: panel.items.filter((item) => item.department === department).length,
      childrenList: panel.items
        .filter((item) => item.department === department)
        .map((item) => ({
          id: item.id,
          name: item.name,
          ...(item.disabled === undefined ? {} : { disabled: item.disabled }),
          childCount: 0,
        })),
    }))
    return {
      treeData,
      fieldNames: { key: 'id', title: 'name', children: 'childrenList' },
      isLeaf: (node) => node.childCount === 0,
      features: [
        expansionFeature({ defaultExpandedKeys: treeData.map((item) => item.id) }),
        checkFeature(),
      ],
      checkedKeys: panel.checkedKeys,
      onCheckedKeysChange: panel.setCheckedKeys,
    }
  })
}
