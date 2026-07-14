import { ChangeDetectionStrategy, Component } from '@angular/core'
import { asyncLoadFeature } from '@fex/components-core/tree/features/async-load'
import { expansionFeature } from '@fex/components-core/tree/features/expansion'
import type { TreeKey, TreeOptions } from '@fex/components-core/tree/types'
import Card from '@fex/components-angular/ui/card'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, type DepartmentNode } from './data'

const data: DepartmentNode[] = [{ id: 'remote-root', name: 'Remote root', childCount: 2 }]

async function loadChildren(item: { key: TreeKey; node: DepartmentNode }) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 800))
  return [
    { id: `${item.key}-a`, name: `${item.node.name} child A`, childCount: 0 },
    { id: `${item.key}-b`, name: `${item.node.name} child B`, childCount: 0 },
  ]
}

@Component({
  selector: 'fex-async-tree-demo',
  standalone: true,
  imports: [Card, DemoTreeComponent],
  templateUrl: './async-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AsyncTreeDemoComponent {
  protected readonly options: TreeOptions<DepartmentNode> = {
    treeData: data,
    fieldNames: departmentFieldNames,
    isLeaf: (node) => node.childCount === 0,
    features: [expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren })],
  }
}
