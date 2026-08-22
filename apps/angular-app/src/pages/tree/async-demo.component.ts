import { ChangeDetectionStrategy, Component } from '@angular/core'
import { asyncLoadFeature } from '@fex-design/core/tree/features/async-load'
import { expansionFeature } from '@fex-design/core/tree/features/expansion'
import type { TreeKey, TreeOptions } from '@fex-design/core/tree/types'
import Card from '@fex-design/angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, type DepartmentNode } from './data'
import { getDemoTreeChildren, getDemoTreeRoots, type DemoDepartmentNode } from '@fex/mock/tree-api'
import { signal } from '@angular/core'

const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }) }))
const loadChildren = async (item: { key: TreeKey }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))

@Component({
  selector: 'fex-async-tree-demo',
  standalone: true,
  imports: [Card, DemoTreeComponent],
  templateUrl: './async-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncTreeDemoComponent {
  private readonly data = signal<DepartmentNode[]>([])
  protected readonly options = (): TreeOptions<DepartmentNode> => ({
    treeData: this.data(),
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren })],
  })
  constructor() { void getDemoTreeRoots().then((nodes) => this.data.set(convert(nodes))) }
}
