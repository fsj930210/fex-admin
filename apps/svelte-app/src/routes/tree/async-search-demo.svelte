<script lang="ts">
  import { expansionFeature, selectionFeature } from '@fex-design/core'
  import InputRoot from '@fex-design/svelte/primitive/input'
  import InputControl from '@fex-design/svelte/primitive/input-control'
  import InputClear from '@fex-design/svelte/primitive/input-clear'
  import Listbox from '@fex-design/svelte/primitive/listbox'
  import ListboxItem from '@fex-design/svelte/primitive/listbox-item'
  import Card from '@fex-design/svelte/ui/card'
  import { getDemoTreeSubtree, searchDemoTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
  import DemoTree from './demo-tree.svelte'
  import { departmentFieldNames, type DepartmentNode } from './data'
  const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.children ? { childrenList: convert(node.children) } : {}) }))
  let keyword = $state(''), results: DemoTreeSearchResult[] = $state([]), treeData: DepartmentNode[] = $state([]), selected = $state(''), request: AbortController | undefined
  function search(value: string) { keyword = value; request?.abort(); if (!value.trim()) { results = []; return } request = new AbortController(); void searchDemoTree(value, request.signal).then(value => results = value) }
  function choose(result: DemoTreeSearchResult) { selected = result.node.id; keyword = ''; void getDemoTreeSubtree(result.node.id).then(value => treeData = convert(value.treeData)) }
  function clear() { keyword = ''; results = []; treeData = []; selected = '' }
</script>
<Card title="Async search and locate" description="The real server returns path-aware matches and an ancestor subtree.">
  <InputRoot value={keyword || results.find(item => item.node.id === selected)?.node.name || selected} onValueChange={search} onClear={clear} class="mb-space-md max-w-sm"><InputControl placeholder="Search remote departments" /><InputClear /></InputRoot>
  {#if keyword}<Listbox items={results} getItemValue={(item: unknown) => (item as DemoTreeSearchResult).node.id}>{#each results as result (result.node.id)}<ListboxItem value={result.node.id} class="cursor-pointer rounded-md px-space-sm py-space-xs" onSelect={() => choose(result)}><span class="block text-sm font-medium">{result.node.name}</span><span class="block text-xs text-muted-foreground">{result.path.map(part => part.label).join(' / ')}</span></ListboxItem>{/each}</Listbox>{:else if treeData.length}<DemoTree {treeData} fieldNames={departmentFieldNames} selectedKeys={selected ? [selected] : []} features={[expansionFeature({ defaultExpandedKeys: ['company','engineering','finance','product'] }), selectionFeature()]} />{/if}
</Card>
