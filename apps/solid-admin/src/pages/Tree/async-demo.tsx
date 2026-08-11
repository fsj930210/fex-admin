import { asyncLoadFeature, expansionFeature } from '@fex-design/core'
import { Card } from '@fex-design/solid/ui/card'
import { DemoTree } from './demo-tree'
import { departmentFieldNames, type DepartmentNode } from './data'
import { getDemoTreeChildren, getDemoTreeRoots, type DemoDepartmentNode } from '@fex/mock/tree-api'
import { createSignal, onMount } from 'solid-js'
const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }) }))
const loadChildren = async (item: { key: string | number }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
export function AsyncDemo() {
  const [data, setData] = createSignal<DepartmentNode[]>([])
  onMount(() => void getDemoTreeRoots().then((nodes) => setData(convert(nodes))))
  return (
    <Card
      title="Async children"
      description="A node without children can still expand when isLeaf says it may have descendants."
    >
      <DemoTree
        treeData={data()}
        fieldNames={departmentFieldNames}
        isLeaf={(n) => n.childCount === 0}
        features={[expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren })]}
        class="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </Card>
  )
}
