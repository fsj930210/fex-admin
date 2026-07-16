import { asyncLoadFeature, expansionFeature } from '@fex/components-core'
import { Card } from '@fex/components-solid/ui/card'
import { DemoTree } from './demo-tree'
import { departmentFieldNames, type DepartmentNode } from './data'
const data: DepartmentNode[] = [{ id: 'remote-root', name: 'Remote root', childCount: 2 }]
async function loadChildren(item: { key: string | number; node: DepartmentNode }) {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 800))
  return [
    { id: `${item.key}-a`, name: `${item.node.name} child A`, childCount: 0 },
    { id: `${item.key}-b`, name: `${item.node.name} child B`, childCount: 0 },
  ]
}
export function AsyncDemo() {
  return (
    <Card
      title="Async children"
      description="A node without children can still expand when isLeaf says it may have descendants."
    >
      <DemoTree
        treeData={data}
        fieldNames={departmentFieldNames}
        isLeaf={(n) => n.childCount === 0}
        features={[expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren })]}
        class="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </Card>
  )
}
