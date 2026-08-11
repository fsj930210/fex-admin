import type { TreeSelectValue } from '@fex-design/core/tree-select/types'
import { ListboxItem, ListboxRoot } from '@fex-design/react/primitive/listbox'
import { TreeSelectOption } from '@fex-design/react/primitive/tree-select'
import { Card } from '@fex-design/react/ui/card'
import { Checkbox } from '@fex-design/react/ui/checkbox'
import { getDemoTreeChildren, getDemoTreeExpandedKeys, getDemoTreeRoots, getDemoTreeSubtree, getDemoTreeSubtrees, searchDemoTree, searchDemoTreeAsTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { useRef, useState } from 'react'
import useMount from '@fex-design/react/hooks/use-mount'
import { DemoTreeSelect } from './demo-shell'
import type { DepartmentNode } from '../Tree/data'

function toDepartmentNodes(nodes: readonly DemoDepartmentNode[]): DepartmentNode[] {
  return nodes.map((node) => ({
    id: node.id,
    name: node.name,
    childCount: node.childCount,
    ...(node.disabled === undefined ? {} : { disabled: node.disabled }),
    ...(node.children === undefined ? {} : { childrenList: toDepartmentNodes(node.children) }),
  }))
}

function toDemoDepartmentNodes(nodes: readonly DepartmentNode[]): DemoDepartmentNode[] {
  return nodes.map((node) => ({
    id: node.id,
    name: node.name,
    childCount: node.childCount,
    ...(node.disabled === undefined ? {} : { disabled: node.disabled }),
    ...(node.childrenList === undefined ? {} : { children: toDemoDepartmentNodes(node.childrenList) }),
  }))
}

function ResultList({ results, multiple, selectedValues = [], onSelectResult }: { results: readonly DemoTreeSearchResult[]; multiple?: boolean; selectedValues?: readonly TreeSelectValue[]; onSelectResult?: (result: DemoTreeSearchResult) => void }) {
  return (
    <ListboxRoot items={results} getItemValue={(result) => result.node.id} value={selectedValues} {...(multiple === undefined ? {} : { multiple })}>
      {results.map((result) => (
        <TreeSelectOption
          key={result.node.id}
          item={{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }}
          toggle={multiple}
          clearSearchOnSelect={!multiple}
        >
          {({ selected, select }) => (
            <ListboxItem
              value={result.node.id}
              disabled={result.node.disabled}
              className="flex cursor-pointer items-center gap-space-sm rounded-md px-space-sm py-space-xs data-[selected=true]:bg-accent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
              onClick={(event) => event.stopPropagation()}
              onSelect={() => { select(); onSelectResult?.(result) }}
            >
              {multiple ? <Checkbox checked={selectedValues.includes(result.node.id)} tabIndex={-1} /> : null}
              <span className="min-w-0"><span className="block text-sm font-medium">{result.node.name}</span><span className="block truncate text-xs text-muted-foreground">{result.path.map((part) => part.label).join(' / ')}</span></span>
            </ListboxItem>
          )}
        </TreeSelectOption>
      ))}
    </ListboxRoot>
  )
}

function useAsyncTreeData() {
  const [roots, setRoots] = useState<DemoDepartmentNode[]>([])
  useMount(() => {
    const request = new AbortController()
    void getDemoTreeRoots(request.signal)
      .then(setRoots)
      .catch((error) => { if (error.name !== 'AbortError') throw error })
    return () => request.abort()
  })
  return [roots, setRoots] as const
}

export function AsyncDemos() {
  type AsyncSingleMode = 'browse' | 'search' | 'locating' | 'located'
  const [roots, setRoots] = useAsyncTreeData()
  const [value, setValue] = useState<TreeSelectValue>()
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<DemoTreeSearchResult[]>([])
  const [locatedTree, setLocatedTree] = useState<DemoDepartmentNode[]>([])
  const [rootExpandedKeys, setRootExpandedKeys] = useState<readonly (string | number)[]>([])
  const [locatedExpandedKeys, setLocatedExpandedKeys] = useState<readonly (string | number)[]>([])
  const [mode, setMode] = useState<AsyncSingleMode>('browse')
  const searchRequest = useRef<AbortController | null>(null)
  const locateRequest = useRef<AbortController | null>(null)
  const search = (next: string) => {
    setKeyword(next)
    searchRequest.current?.abort()
    if (!next.trim()) {
      locateRequest.current?.abort()
      setValue(undefined)
      setResults([])
      setLocatedTree([])
      setLocatedExpandedKeys([])
      setMode('browse')
      return
    }
    setMode('search')
    const request = new AbortController(); searchRequest.current = request
    void searchDemoTree(next, request.signal).then(setResults).catch((error) => { if (error.name !== 'AbortError') throw error })
  }
  const locate = (result: DemoTreeSearchResult) => {
    setKeyword('')
    setResults([])
    setMode('locating')
    locateRequest.current?.abort()
    const request = new AbortController(); locateRequest.current = request
    void getDemoTreeSubtree(result.node.id, request.signal).then((response) => {
      setLocatedTree(response.treeData)
      setLocatedExpandedKeys(response.expandedKeys)
      setMode('located')
    })
  }
  return (
    <>
      <Card title="异步单选搜索与路径树回显" description="真实服务端返回带路径的扁平结果；选择后加载祖先路径树，并将目标节点标签回填到输入框。">
        <DemoTreeSelect
          treeData={toDepartmentNodes(roots)}
          value={value}
          searchable
          searchValue={keyword}
          onSearchValueChange={search}
          onChange={(next) => {
            setValue(next as TreeSelectValue | undefined)
            if (next === undefined) {
              locateRequest.current?.abort()
              locateRequest.current = null
              setLocatedTree([])
              setLocatedExpandedKeys([])
              setResults([])
              setKeyword('')
              setMode('browse')
            }
          }}
          onClear={() => setMode('browse')}
          expandedKeys={rootExpandedKeys}
          onExpandedKeysChange={setRootExpandedKeys}
          asyncLoader={async (item, context) => toDepartmentNodes(await getDemoTreeChildren(item.key, context.signal))}
          onTreeDataChange={(next) => setRoots(toDemoDepartmentNodes(next))}
          locatedTreeData={mode === 'located' && locatedTree.length ? toDepartmentNodes(locatedTree) : undefined}
          locatedExpandedKeys={mode === 'located' ? locatedExpandedKeys : undefined}
        >
          {mode === 'search' ? (
            keyword ? <ResultList results={results} onSelectResult={locate} /> : <p className="px-space-sm py-space-xs text-sm text-muted-foreground">请输入关键字搜索</p>
          ) : mode === 'locating' ? (
            <p className="px-space-sm py-space-xs text-sm text-muted-foreground">正在加载路径树…</p>
          ) : undefined}
        </DemoTreeSelect>
      </Card>
      <AsyncMultipleDemo roots={roots} setRoots={setRoots} />
      <AsyncTreeMultipleDemo roots={roots} setRoots={setRoots} />
      <AsyncEchoDemo />
    </>
  )
}

function AsyncTreeMultipleDemo({ roots, setRoots }: { roots: readonly DemoDepartmentNode[]; setRoots: (nodes: DemoDepartmentNode[]) => void }) {
  const [values, setValues] = useState<TreeSelectValue[]>([])
  const [keyword, setKeyword] = useState('')
  const [tree, setTree] = useState<DemoDepartmentNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<readonly (string | number)[]>([])
  const requestRef = useRef<AbortController | null>(null)
  const search = (next: string) => {
    setKeyword(next); requestRef.current?.abort()
    if (!next.trim()) { setTree([]); setExpandedKeys([]); return }
    const request = new AbortController(); requestRef.current = request
    void searchDemoTreeAsTree(next, request.signal).then((nodes) => { setTree(nodes); setExpandedKeys(getDemoTreeExpandedKeys(nodes)) })
  }
  return (
    <Card title="异步多选搜索：裁剪树" description="后端只返回命中节点及其祖先。局部结果无法代表未加载的完整后代，因此示例使用严格勾选，父子不联动。">
      <DemoTreeSelect treeData={toDepartmentNodes(keyword ? tree : roots)} multiple checkStrictly value={values} searchable searchValue={keyword} onSearchValueChange={search} onChange={(next) => setValues((next as TreeSelectValue[]) ?? [])} onClear={() => { setKeyword(''); setTree([]); setExpandedKeys([]) }} expandedKeys={expandedKeys} onExpandedKeysChange={setExpandedKeys} asyncLoader={keyword ? undefined : async (item, context) => toDepartmentNodes(await getDemoTreeChildren(item.key, context.signal))} onTreeDataChange={keyword ? undefined : (next) => setRoots(toDemoDepartmentNodes(next))} />
    </Card>
  )
}

function AsyncMultipleDemo({ roots, setRoots }: { roots: readonly DemoDepartmentNode[]; setRoots: (nodes: DemoDepartmentNode[]) => void }) {
  const [values, setValues] = useState<TreeSelectValue[]>([])
  const [keyword, setKeyword] = useState('')
  const [results, setResults] = useState<DemoTreeSearchResult[]>([])
  const [expandedKeys, setExpandedKeys] = useState<readonly (string | number)[]>([])
  const [showResults, setShowResults] = useState(false)
  const requestRef = useRef<AbortController | null>(null)
  const search = (next: string) => {
    setKeyword(next); requestRef.current?.abort()
    if (!next.trim()) { setResults([]); setShowResults(false); return }
    setShowResults(true)
    const request = new AbortController(); requestRef.current = request
    void searchDemoTree(next, request.signal).then(setResults)
  }
  return (
    <Card title="异步多选搜索" description="选中项会跨搜索词保留，建议使用复选框反馈；结果区域仍可完全自定义。">
      <DemoTreeSelect
        treeData={toDepartmentNodes(roots)}
        multiple
        value={values}
        searchable
        searchValue={keyword}
        onSearchValueChange={search}
        onChange={(next) => setValues((next as TreeSelectValue[]) ?? [])}
        onClear={() => {
          setKeyword('')
          setResults([])
          setShowResults(false)
        }}
        expandedKeys={expandedKeys}
        onExpandedKeysChange={setExpandedKeys}
        asyncLoader={async (item, context) => toDepartmentNodes(await getDemoTreeChildren(item.key, context.signal))}
        onTreeDataChange={(next) => setRoots(toDemoDepartmentNodes(next))}
      >
        {showResults ? (
          <ResultList
            results={results}
            multiple
            selectedValues={values}
          />
        ) : undefined}
      </DemoTreeSelect>
    </Card>
  )
}

function AsyncEchoDemo() {
  const initialValue = ['company', 'finance', 'design-system']
  const [treeData, setTreeData] = useState<DemoDepartmentNode[]>([])
  const [expandedKeys, setExpandedKeys] = useState<readonly (string | number)[]>([])
  useMount(() => {
    const request = new AbortController()
    void getDemoTreeSubtrees(initialValue, request.signal)
      .then((result) => {
        setTreeData(result.treeData)
        setExpandedKeys(result.expandedKeys)
      })
      .catch((error) => { if (error.name !== 'AbortError') throw error })
    return () => request.abort()
  })
  return (
    <Card title="异步值回显" description="一次解析根节点、分支节点和叶节点三个不同层级的已有值。">
      <DemoTreeSelect
        treeData={toDepartmentNodes(treeData)}
        multiple
        checkStrictly
        defaultValue={initialValue}
        expandedKeys={expandedKeys}
        onExpandedKeysChange={setExpandedKeys}
        onClear={() => {
          setTreeData([])
          setExpandedKeys([])
          void getDemoTreeRoots().then(setTreeData)
        }}
        asyncLoader={async (item, context) => toDepartmentNodes(await getDemoTreeChildren(item.key, context.signal))}
        onTreeDataChange={(next) => setTreeData(toDemoDepartmentNodes(next))}
      />
    </Card>
  )
}
