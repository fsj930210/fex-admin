import { expansionFeature, selectionFeature } from '@fex-design/core'
import { InputClear, InputControl, InputRoot } from '@fex-design/solid/primitive/input'
import { ListboxItem, ListboxRoot } from '@fex-design/solid/primitive/listbox'
import { Card } from '@fex-design/solid/ui/card'
import { getDemoTreeSubtree, searchDemoTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { createSignal, For, Show } from 'solid-js'
import { DemoTree } from './demo-tree'
import { departmentFieldNames, type DepartmentNode } from './data'
const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.children ? { childrenList: convert(node.children) } : {}) }))
export function AsyncSearchDemo() {
  const [keyword, setKeyword] = createSignal(''), [results, setResults] = createSignal<DemoTreeSearchResult[]>([]), [treeData, setTreeData] = createSignal<DepartmentNode[]>([]), [selected, setSelected] = createSignal('')
  let request: AbortController | undefined
  const search = (value: string) => { setKeyword(value); request?.abort(); if (!value.trim()) { setResults([]); return } request = new AbortController(); void searchDemoTree(value, request.signal).then(setResults) }
  const choose = (result: DemoTreeSearchResult) => { setSelected(result.node.id); setKeyword(''); void getDemoTreeSubtree(result.node.id).then(data => setTreeData(convert(data.treeData))) }
  const clear = () => { setKeyword(''); setResults([]); setTreeData([]); setSelected('') }
  return <Card title="Async search and locate" description="The real server returns path-aware matches and an ancestor subtree."><InputRoot value={keyword() || results().find(item => item.node.id === selected())?.node.name || selected()} onValueChange={search} onClear={clear} class="mb-space-md max-w-sm"><InputControl placeholder="Search remote departments" /><InputClear /></InputRoot><Show when={keyword()} fallback={<Show when={treeData().length}><DemoTree treeData={treeData()} fieldNames={departmentFieldNames} selectedKeys={selected() ? [selected()] : []} features={[expansionFeature<DepartmentNode>({ defaultExpandedKeys: ['company','engineering','finance','product'] }), selectionFeature<DepartmentNode>()]} /></Show>}><ListboxRoot items={results()} getItemValue={item => item.node.id}><For each={results()}>{result => <ListboxItem value={result.node.id} class="cursor-pointer rounded-md px-space-sm py-space-xs" onSelect={() => choose(result)}><span class="block text-sm font-medium">{result.node.name}</span><span class="block text-xs text-muted-foreground">{result.path.map(part => part.label).join(' / ')}</span></ListboxItem>}</For></ListboxRoot></Show></Card>
}
