import { expansionFeature, selectionFeature } from '@fex-design/core'
import { InputClear, InputControl, InputRoot } from '@fex-design/react/primitive/input'
import { ListboxItem, ListboxRoot } from '@fex-design/react/primitive/listbox'
import { getDemoTreeSubtree, searchDemoTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { useRef, useState } from 'react'
import { DemoTree } from './demo-tree'
import { TreeDemoSection } from './demo-section'
import { departmentFieldNames, type DepartmentNode } from './data'
const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.children ? { childrenList: convert(node.children) } : {}) }))
export function AsyncSearchTreeDemo() {
  const [keyword, setKeyword] = useState(''), [results, setResults] = useState<DemoTreeSearchResult[]>([]), [treeData, setTreeData] = useState<DepartmentNode[]>([]), [selectedKey, setSelectedKey] = useState<string>(), [expandedKeys, setExpandedKeys] = useState<readonly (string | number)[]>([])
  const requestRef = useRef<AbortController | null>(null)
  const search = (value: string) => { setKeyword(value); requestRef.current?.abort(); if (!value.trim()) { setResults([]); return } const request = new AbortController(); requestRef.current = request; void searchDemoTree(value, request.signal).then(setResults) }
  const choose = (result: DemoTreeSearchResult) => { setSelectedKey(result.node.id); setKeyword(''); void getDemoTreeSubtree(result.node.id).then((response) => { setTreeData(convert(response.treeData)); setExpandedKeys(response.expandedKeys) }) }
  const clear = () => { setKeyword(''); setResults([]); setTreeData([]); setSelectedKey(undefined); setExpandedKeys([]) }
  return <TreeDemoSection title="Async search and locate" description="The real server returns flat path-aware matches; selecting one loads and displays its ancestor subtree.">
    <InputRoot value={keyword || (selectedKey ? results.find((item) => item.node.id === selectedKey)?.node.name ?? selectedKey : '')} onValueChange={(value) => search(value)} onClear={clear} className="mb-space-md max-w-sm"><InputControl placeholder="Search remote departments" /><InputClear /></InputRoot>
    {keyword ? <ListboxRoot items={results} getItemValue={(item) => item.node.id} className="max-w-xl">{results.map((result) => <ListboxItem key={result.node.id} value={result.node.id} onSelect={() => choose(result)} className="cursor-pointer rounded-md px-space-sm py-space-xs"><span className="block text-sm font-medium">{result.node.name}</span><span className="block text-xs text-muted-foreground">{result.path.map((part) => part.label).join(' / ')}</span></ListboxItem>)}</ListboxRoot> : treeData.length ? <DemoTree treeData={treeData} fieldNames={departmentFieldNames} expandedKeys={expandedKeys} onExpandedKeysChange={setExpandedKeys} selectedKeys={selectedKey ? [selectedKey] : []} features={[expansionFeature<DepartmentNode>(), selectionFeature<DepartmentNode>()]} /> : null}
  </TreeDemoSection>
}
