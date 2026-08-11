<script lang="ts">
  import { searchFeature } from '@fex-design/core'
  import { createTreeController } from '@fex-design/core/tree/create-tree-controller'
  import type { SearchFeatureApi } from '@fex-design/core/tree/features/search'
  import type { TreeItem, TreeKey } from '@fex-design/core/tree/types'
  import type { TreeSelectValue } from '@fex-design/core/tree-select/types'
  import Listbox from '@fex-design/svelte/primitive/listbox'
  import ListboxItem from '@fex-design/svelte/primitive/listbox-item'
  import TreeSelectOption from '@fex-design/svelte/primitive/tree-select-option'
  import Card from '@fex-design/svelte/ui/card'
  import Checkbox from '@fex-design/svelte/ui/checkbox'
  import { getDemoTreeChildren, getDemoTreeExpandedKeys, getDemoTreeRoots, getDemoTreeSubtree, getDemoTreeSubtrees, searchDemoTree, searchDemoTreeAsTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
  import { onMount } from 'svelte'
  import { departmentFieldNames, departmentTreeData, type DepartmentNode } from '../tree/data'
  import DemoTreeSelect from './demo-tree-select.svelte'
  let controlled: TreeSelectValue = $state('platform'), keyword = $state(''), asyncKeyword = $state('')
  let roots: DemoDepartmentNode[] = $state([]), results: DemoTreeSearchResult[] = $state([]), located: DemoDepartmentNode[] = $state([])
  let echoTree: DemoDepartmentNode[] = $state([])
  let echoExpanded: readonly TreeKey[] = $state([])
  let selected: TreeSelectValue | undefined = $state(), request: AbortController | undefined
  let asyncMode: 'browse' | 'search' | 'locating' | 'located' = $state('browse'), asyncExpanded: readonly TreeKey[] = $state([]), locateRequest: AbortController | undefined
  let multiKeyword = $state(''), multiResults: DemoTreeSearchResult[] = $state([]), multiValues: TreeSelectValue[] = $state([]), multiRequest: AbortController | undefined
  let multiResultsVisible = $state(false), multiExpanded: readonly TreeKey[] = $state([])
  let treeKeyword = $state(''), croppedTree: DemoDepartmentNode[] = $state([]), treeValues: TreeSelectValue[] = $state([])
  let treeExpanded: readonly TreeKey[] = $state([])
  let treeRequest: AbortController | undefined
  const syncController = createTreeController<DepartmentNode>({ treeData: departmentTreeData, fieldNames: departmentFieldNames, features: [searchFeature()] })
  let syncData = $derived(keyword ? syncController.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({ keyword, filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()) }) ?? [] : departmentTreeData)
  const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.children ? { childrenList: convert(node.children) } : {}) }))
  const toDemo = (nodes: readonly DepartmentNode[]): DemoDepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.childrenList ? { children: toDemo(node.childrenList) } : {}) }))
  const loadChildren = async (item: TreeItem<DepartmentNode>, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
  const echoValues = ['company', 'finance', 'design-system']
  onMount(() => { void getDemoTreeRoots().then(value => roots = value); void getDemoTreeSubtrees(echoValues).then(value => { echoTree = value.treeData; echoExpanded = value.expandedKeys }); return () => { request?.abort(); multiRequest?.abort(); locateRequest?.abort(); treeRequest?.abort() } })
  function search(value: string) { asyncKeyword = value; request?.abort(); if (!value.trim()) { selected = undefined; results = []; located = []; asyncExpanded = []; asyncMode = 'browse'; return } asyncMode = 'search'; request = new AbortController(); void searchDemoTree(value, request.signal).then(value => results = value) }
  function choose(result: DemoTreeSearchResult, select: () => void) { select(); selected = result.node.id; asyncKeyword = ''; results = []; asyncMode = 'locating'; locateRequest?.abort(); locateRequest = new AbortController(); void getDemoTreeSubtree(result.node.id, locateRequest.signal).then(value => { located = value.treeData; asyncExpanded = value.expandedKeys; asyncMode = 'located' }) }
  function clearSingle() { selected = undefined; asyncKeyword = ''; results = []; located = []; asyncExpanded = []; asyncMode = 'browse' }
  function searchMultiple(value: string) { multiKeyword = value; multiRequest?.abort(); if (!value.trim()) { multiResults = []; multiResultsVisible = false; return } multiResultsVisible = true; multiRequest = new AbortController(); void searchDemoTree(value, multiRequest.signal).then(value => multiResults = value) }
  function clearMultiple() { multiValues = []; multiKeyword = ''; multiResults = []; multiResultsVisible = false }
  function searchTree(value: string) { treeKeyword = value; treeRequest?.abort(); if (!value.trim()) { croppedTree = []; treeExpanded = []; return } treeRequest = new AbortController(); void searchDemoTreeAsTree(value, treeRequest.signal).then(value => { croppedTree = value; treeExpanded = getDemoTreeExpandedKeys(value) }).catch(error => { if (error.name !== 'AbortError') throw error }) }
</script>
{#snippet resultsContent()}{#if asyncMode === 'search'}<Listbox items={results} getItemValue={(item: unknown) => (item as DemoTreeSearchResult).node.id}>{#each results as result (result.node.id)}<TreeSelectOption item={{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }}>{#snippet children(option)}<ListboxItem value={result.node.id} disabled={result.node.disabled} class="cursor-pointer rounded-md px-space-sm py-space-xs data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50" onSelect={() => choose(result, option.select)}><span class="block text-sm font-medium">{result.node.name}</span><span class="block text-xs text-muted-foreground">{result.path.map(part => part.label).join(' / ')}</span></ListboxItem>{/snippet}</TreeSelectOption>{/each}</Listbox>{:else}<p class="px-space-sm py-space-xs text-sm text-muted-foreground">正在加载路径树…</p>{/if}{/snippet}
{#snippet multiContent()}<Listbox multiple value={multiValues} items={multiResults} getItemValue={(item: unknown) => (item as DemoTreeSearchResult).node.id}>{#each multiResults as result (result.node.id)}<TreeSelectOption toggle clearSearchOnSelect={false} item={{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }}>{#snippet children(option)}<ListboxItem value={result.node.id} disabled={result.node.disabled} class="flex cursor-pointer items-center gap-space-sm rounded-md px-space-sm py-space-xs data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50" onSelect={option.select}><Checkbox checked={multiValues.includes(result.node.id)} disabled={result.node.disabled} /><span><span class="block text-sm font-medium">{result.node.name}</span><span class="block text-xs text-muted-foreground">{result.path.map(part => part.label).join(' / ')}</span></span></ListboxItem>{/snippet}</TreeSelectOption>{/each}</Listbox>{/snippet}
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto grid w-full max-w-5xl gap-space-xl">
  <header><a href="/" class="text-sm text-muted-foreground">返回首页</a><h1 class="text-2xl font-semibold">TreeSelect 树选择</h1><p class="text-sm text-muted-foreground">由输入框、弹出层和树组合而成，搜索结果由使用方控制。</p></header>
  <div class="grid gap-space-xl">
    <Card title="非受控" description="只读输入框打开树，并回填选中节点的标签。"><DemoTreeSelect treeData={departmentTreeData} defaultValue="frontend" /></Card>
    <Card title="受控与回显" description="选中值由应用管理。"><DemoTreeSelect treeData={departmentTreeData} value={controlled} onChange={value => controlled = value as TreeSelectValue} /><p class="mt-space-sm text-sm">当前值：{controlled}</p></Card>
    <Card title="多选" description="建议使用复选框提供选中反馈，也支持完全自定义选中状态的展示。"><DemoTreeSelect treeData={departmentTreeData} multiple defaultValue={['frontend', 'research']} /></Card>
    <Card title="同步搜索" description="复用 Tree 的 searchFeature。"><DemoTreeSelect treeData={syncData} searchable searchValue={keyword} onSearch={value => keyword = value} /></Card>
    <Card title="异步单选搜索与路径树回显" description="真实服务端返回路径以区分同名节点，选择后加载祖先路径树。">
      <DemoTreeSelect treeData={convert(located.length ? located : roots)} searchable value={selected} searchValue={asyncKeyword} contentActive={asyncMode === 'search' || asyncMode === 'locating'} expandedKeys={asyncExpanded} onExpandedKeysChange={keys => asyncExpanded = keys} asyncLoader={loadChildren} onTreeDataChange={nodes => located.length ? located = toDemo(nodes) : roots = toDemo(nodes)} onSearch={search} onChange={value => selected = value as TreeSelectValue} onClear={clearSingle} content={resultsContent} />
    </Card>
    <Card title="异步多选搜索" description="选中项会跨搜索词保留，结果列表支持连续勾选。"><DemoTreeSelect treeData={convert(roots)} multiple value={multiValues} searchable searchValue={multiKeyword} contentActive={multiResultsVisible} expandedKeys={multiExpanded} onExpandedKeysChange={keys => multiExpanded = keys} asyncLoader={loadChildren} onTreeDataChange={nodes => roots = toDemo(nodes)} onSearch={searchMultiple} onChange={value => multiValues = (value as TreeSelectValue[]) ?? []} onClear={clearMultiple} content={multiContent} /></Card>
    <Card title="异步多选搜索：裁剪树" description="后端只返回命中节点及其祖先。局部结果无法代表未加载的完整后代，因此使用严格勾选，父子不联动。"><DemoTreeSelect treeData={convert(treeKeyword ? croppedTree : roots)} multiple checkStrictly value={treeValues} searchable searchValue={treeKeyword} expandedKeys={treeExpanded} onExpandedKeysChange={keys => treeExpanded = keys} onSearch={searchTree} onChange={value => treeValues = (value as TreeSelectValue[]) ?? []} onClear={() => { treeKeyword = ''; croppedTree = []; treeExpanded = [] }} asyncLoader={treeKeyword ? undefined : loadChildren} onTreeDataChange={treeKeyword ? undefined : nodes => roots = toDemo(nodes)} /></Card>
    <Card title="异步值回显" description="一次解析根节点、分支节点和叶节点三个不同层级的已有值。"><DemoTreeSelect treeData={convert(echoTree)} multiple checkStrictly defaultValue={echoValues} expandedKeys={echoExpanded} onExpandedKeysChange={keys => echoExpanded = keys} asyncLoader={loadChildren} onTreeDataChange={nodes => echoTree = toDemo(nodes)} onClear={() => { echoTree = [...roots]; echoExpanded = [] }} /></Card>
  </div>
</div></main>
