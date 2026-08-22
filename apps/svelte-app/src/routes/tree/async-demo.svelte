<script lang="ts">
  import { asyncLoadFeature, expansionFeature } from '@fex-design/core'
  import Card from '@fex-design/svelte/ui/card'
  import { getDemoTreeChildren, getDemoTreeRoots, type DemoDepartmentNode } from '@fex/mock/tree-api'
  import { onMount } from 'svelte'
  import DemoTree from './demo-tree.svelte'
  import { departmentFieldNames, type DepartmentNode } from './data'
  const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }) }))
  let data: DepartmentNode[] = $state([])
  const loadChildren = async (item: { key: string | number }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
  onMount(() => { void getDemoTreeRoots().then(nodes => data = convert(nodes)) })
</script>
<Card title="Async children" description="A real local Nest service supplies roots and child nodes.">
  <DemoTree treeData={data} fieldNames={departmentFieldNames} isLeaf={node => node.childCount === 0} features={[expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren })]} class="max-w-xl rounded-md border border-border bg-background p-space-sm" />
</Card>
