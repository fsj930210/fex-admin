import { asyncLoadFeature, checkFeature, expansionFeature, searchFeature, selectionFeature } from '@fex-design/core'
import { createTreeController } from '@fex-design/core/tree/create-tree-controller'
import type { SearchFeatureApi } from '@fex-design/core/tree/features/search'
import type { TreeItem, TreeKey } from '@fex-design/core/tree/types'
import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { InputClear, InputControl, InputRoot } from '@fex-design/solid/primitive/input'
import { ListboxItem, ListboxRoot } from '@fex-design/solid/primitive/listbox'
import { TreeSelectContent, TreeSelectOption, TreeSelectRoot, TreeSelectTrigger, useTreeSelect } from '@fex-design/solid/primitive/tree-select'
import { Card } from '@fex-design/solid/ui/card'
import { Checkbox } from '@fex-design/solid/ui/checkbox'
import { treeSelectTagClassName, treeSelectTagOverflowClassName, treeSelectTagRemoveClassName } from '@fex-design/styles/select'
import { CloseIcon } from '@fex-design/solid/icon/close'
import { inputControlClassName } from '@fex-design/styles/input'
import { getDemoTreeChildren, getDemoTreeExpandedKeys, getDemoTreeRoots, getDemoTreeSubtree, getDemoTreeSubtrees, searchDemoTree, searchDemoTreeAsTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { A } from '@solidjs/router'
import { createMemo, createSignal, For, onCleanup, onMount, Show, type JSX } from 'solid-js'
import { DemoTree } from '../Tree/demo-tree'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from '../Tree/data'

function convert(nodes: readonly DemoDepartmentNode[]): DepartmentNode[] {
  return nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.children ? { childrenList: convert(node.children) } : {}) }))
}
function toDemo(nodes: readonly DepartmentNode[]): DemoDepartmentNode[] {
  return nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.childrenList ? { children: toDemo(node.childrenList) } : {}) }))
}
function toItems(nodes: readonly DepartmentNode[]): TreeSelectItem<DepartmentNode>[] {
  return nodes.flatMap((node) => [{ value: node.id, label: node.name, node }, ...toItems(node.childrenList ?? [])])
}
function Highlight(props: { label: string; keyword?: string }) {
  const range = createMemo(() => {
    const keyword = props.keyword?.trim() ?? ''
    const index = props.label.toLowerCase().indexOf(keyword.toLowerCase())
    return !keyword || index < 0 ? undefined : [index, index + keyword.length] as const
  })
  return <Show when={range()} fallback={props.label}>{(match) => <>{props.label.slice(0, match()[0])}<mark>{props.label.slice(match()[0], match()[1])}</mark>{props.label.slice(match()[1])}</>}</Show>
}
function SelectedTags(props: { max: number }) { const treeSelect = useTreeSelect<DepartmentNode>(); return <Show when={treeSelect.snapshot().selectedItems.length <= props.max} fallback={<span class={`${treeSelectTagOverflowClassName} ml-1.5`}>已选择 {treeSelect.snapshot().selectedItems.length} 项</span>}><For each={treeSelect.snapshot().selectedItems}>{(item) => <span class={`${treeSelectTagClassName} ml-1.5`}>{item.label}<button type="button" aria-label={`删除 ${item.label}`} class={treeSelectTagRemoveClassName} onPointerDown={(event) => event.preventDefault()} onClick={(event) => { event.stopPropagation(); treeSelect.controller.setValues(treeSelect.snapshot().values.filter((value) => value !== item.value)) }}><CloseIcon /></button></span>}</For></Show> }
function DemoClear(props: { onClear?: () => void }) {
  const treeSelect = useTreeSelect<DepartmentNode>()
  return <Show when={treeSelect.snapshot().selectedItems.length > 0 || Boolean(treeSelect.searchValue())}>
    <InputClear forceMount aria-label="清除" onClick={(event) => {
      event.stopPropagation()
      event.preventDefault()
      treeSelect.controller.clear()
      treeSelect.setSearchValue('')
      props.onClear?.()
    }} />
  </Show>
}

interface DemoSelectProps {
  treeData: readonly DepartmentNode[]
  value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  multiple?: boolean
  checkStrictly?: boolean
  maxTagCount?: number
  searchable?: boolean
  searchValue?: string
  contentActive?: boolean
  expandedKeys?: readonly TreeKey[]
  onExpandedKeysChange?: (keys: readonly TreeKey[]) => void
  asyncLoader?: (item: TreeItem<DepartmentNode>, context: { signal: AbortSignal }) => Promise<readonly DepartmentNode[]>
  onTreeDataChange?: (nodes: readonly DepartmentNode[]) => void
  onSearch?: (value: string) => void
  onChange?: (value: TreeSelectValue | TreeSelectValue[] | undefined) => void
  onClear?: () => void
  children?: JSX.Element
}
function Panel(props: DemoSelectProps) {
  const treeSelect = useTreeSelect<DepartmentNode>()
  const features = [
    expansionFeature<DepartmentNode>(props.expandedKeys === undefined ? { defaultExpandedKeys: ['company', 'engineering', 'finance', 'product'] } : {}),
    ...(props.asyncLoader ? [asyncLoadFeature<DepartmentNode>({ loadChildren: props.asyncLoader })] : []),
    ...(props.multiple ? [checkFeature<DepartmentNode>({ mode: props.checkStrictly ? 'strict' : 'cascade' })] : [selectionFeature<DepartmentNode>()]),
  ]
  return <TreeSelectContent class="w-80 p-space-sm">
    <Show when={props.contentActive} fallback={<DemoTree
      treeData={props.treeData}
      fieldNames={departmentFieldNames}
      isLeaf={(node) => node.childCount === 0}
      features={features}
      selectedKeys={props.multiple ? [] : treeSelect.snapshot().values}
      checkedKeys={props.multiple ? treeSelect.snapshot().values : undefined}
      onCheckedKeysChange={props.multiple ? (keys, meta) => {
        if (!props.checkStrictly) { treeSelect.controller.setValues(keys); return }
        const next = new Set(treeSelect.snapshot().values)
        meta.changedKeys.forEach((key) => keys.includes(key) ? next.add(key) : next.delete(key))
        treeSelect.controller.setValues([...next])
      } : undefined}
      checkable={props.multiple}
      expandedKeys={props.expandedKeys}
      onExpandedKeysChange={props.onExpandedKeysChange}
      onTreeDataChange={props.onTreeDataChange}
      itemClass="cursor-pointer data-[disabled=true]:cursor-not-allowed"
      searchKeyword={props.searchValue ?? ''}
      titleRender={({ item }) => <TreeSelectOption item={{ value: item.key, label: item.node.name, node: item.node, disabled: item.disabled }}>{(option) => <button type="button" disabled={item.disabled} data-selected={!props.multiple && option.selected || undefined} class="rounded-sm px-space-xs text-left data-[selected]:bg-accent disabled:cursor-not-allowed" onClick={(event) => { event.stopPropagation(); option.select() }}><Highlight label={item.node.name} keyword={props.searchValue} /></button>}</TreeSelectOption>}
    />}>{props.children}</Show>
  </TreeSelectContent>
}
function DemoSelect(props: DemoSelectProps) {
  const items = createMemo(() => toItems(props.treeData))
  return <TreeSelectRoot
    items={items()}
    {...(props.value === undefined && props.onChange === undefined ? {} : { value: props.value })}
    defaultValue={props.defaultValue}
    multiple={props.multiple}
    searchable={props.searchable}
    searchValue={props.searchValue}
    onSearchValueChange={props.onSearch}
    onChange={(value) => props.onChange?.(value)}
  >
    <TreeSelectTrigger>{(state) => <InputRoot {...(state.trigger.props as unknown as JSX.HTMLAttributes<HTMLDivElement>)} ref={state.trigger.ref as never} value={state.inputProps.value} onClear={() => { state.clear(); props.onClear?.() }} class="w-80"><Show when={props.multiple}><SelectedTags max={props.maxTagCount ?? 2} /></Show><Show when={props.multiple} fallback={<InputControl readOnly={state.inputProps.readOnly} placeholder={state.selectedItems.length ? undefined : props.searchable ? '搜索部门' : '请选择部门'} onInput={state.inputProps.onInput} onFocus={state.inputProps.onFocus} onClick={state.inputProps.onClick} />}><input value={props.searchValue ?? ''} readOnly={!props.searchable} placeholder={state.selectedItems.length ? undefined : props.searchable ? '搜索部门' : '请选择部门'} class={inputControlClassName} onInput={(event) => props.onSearch?.(event.currentTarget.value)} onFocus={state.inputProps.onFocus} onClick={state.inputProps.onClick} /></Show><DemoClear onClear={props.onClear} /></InputRoot>}</TreeSelectTrigger>
    <Panel {...props} />
  </TreeSelectRoot>
}

export function TreeSelectPage() {
  type AsyncMode = 'browse' | 'search' | 'locating' | 'located'
  const [controlled, setControlled] = createSignal<TreeSelectValue>('platform')
  const [keyword, setKeyword] = createSignal('')
  const syncController = createTreeController<DepartmentNode>({ treeData: departmentTreeData, fieldNames: departmentFieldNames, features: [searchFeature()] })
  const syncData = createMemo(() => keyword() ? syncController.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({ keyword: keyword(), filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()) }) ?? [] : departmentTreeData)
  const [roots, setRoots] = createSignal<DemoDepartmentNode[]>([])
  const [asyncKeyword, setAsyncKeyword] = createSignal(''), [results, setResults] = createSignal<DemoTreeSearchResult[]>([]), [selected, setSelected] = createSignal<TreeSelectValue>(), [located, setLocated] = createSignal<DemoDepartmentNode[]>([]), [mode, setMode] = createSignal<AsyncMode>('browse'), [asyncExpanded, setAsyncExpanded] = createSignal<readonly TreeKey[]>([])
  const [multiKeyword, setMultiKeyword] = createSignal(''), [multiResults, setMultiResults] = createSignal<DemoTreeSearchResult[]>([]), [multiValues, setMultiValues] = createSignal<TreeSelectValue[]>([]), [multiResultsVisible, setMultiResultsVisible] = createSignal(false), [multiExpanded, setMultiExpanded] = createSignal<readonly TreeKey[]>([])
  const [treeKeyword, setTreeKeyword] = createSignal(''), [croppedTree, setCroppedTree] = createSignal<DemoDepartmentNode[]>([]), [treeValues, setTreeValues] = createSignal<TreeSelectValue[]>([])
  const [treeExpanded, setTreeExpanded] = createSignal<readonly TreeKey[]>([])
  const [echoTree, setEchoTree] = createSignal<DemoDepartmentNode[]>([]), [echoExpanded, setEchoExpanded] = createSignal<readonly TreeKey[]>([])
  const rootTreeData = createMemo(() => convert(roots()))
  const asyncTreeData = createMemo(() => convert(located().length ? located() : roots()))
  const echoTreeData = createMemo(() => convert(echoTree()))
  let request: AbortController | undefined, multiRequest: AbortController | undefined, locateRequest: AbortController | undefined, treeRequest: AbortController | undefined
  const echoValues = ['company', 'finance', 'design-system']
  onMount(() => { void getDemoTreeRoots().then(setRoots); void getDemoTreeSubtrees(echoValues).then((data) => { setEchoTree(data.treeData); setEchoExpanded(data.expandedKeys) }) })
  onCleanup(() => { request?.abort(); multiRequest?.abort(); locateRequest?.abort(); treeRequest?.abort() })
  const loadChildren = async (item: TreeItem<DepartmentNode>, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
  const search = (value: string) => { setAsyncKeyword(value); request?.abort(); if (!value.trim()) { setSelected(); setResults([]); setLocated([]); setAsyncExpanded([]); setMode('browse'); return } setMode('search'); request = new AbortController(); void searchDemoTree(value, request.signal).then(setResults) }
  const choose = (result: DemoTreeSearchResult, select: () => void) => { select(); setSelected(result.node.id); setAsyncKeyword(''); setResults([]); setMode('locating'); locateRequest?.abort(); locateRequest = new AbortController(); void getDemoTreeSubtree(result.node.id, locateRequest.signal).then((data) => { setLocated(data.treeData); setAsyncExpanded(data.expandedKeys); setMode('located') }) }
  const clearSingle = () => { setSelected(); setAsyncKeyword(''); setResults([]); setLocated([]); setAsyncExpanded([]); setMode('browse') }
  const searchMultiple = (value: string) => { setMultiKeyword(value); multiRequest?.abort(); if (!value.trim()) { setMultiResults([]); setMultiResultsVisible(false); return } setMultiResultsVisible(true); multiRequest = new AbortController(); void searchDemoTree(value, multiRequest.signal).then(setMultiResults) }
  const clearMultiple = () => { setMultiValues([]); setMultiKeyword(''); setMultiResults([]); setMultiResultsVisible(false) }
  const searchTree = (value: string) => { setTreeKeyword(value); treeRequest?.abort(); if (!value.trim()) { setCroppedTree([]); setTreeExpanded([]); return } treeRequest = new AbortController(); void searchDemoTreeAsTree(value, treeRequest.signal).then((nodes) => { setCroppedTree(nodes); setTreeExpanded(getDemoTreeExpandedKeys(nodes)) }).catch((error) => { if (error.name !== 'AbortError') throw error }) }
  const resultClass = "flex cursor-pointer items-center gap-space-sm rounded-md px-space-sm py-space-xs data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50"
  return <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto grid w-full max-w-5xl gap-space-xl">
    <header><A href="/" class="text-sm text-muted-foreground">返回首页</A><h1 class="text-2xl font-semibold">TreeSelect 树选择</h1><p class="text-sm text-muted-foreground">由输入框、弹出层和树组合而成，搜索请求与结果渲染由使用方控制。</p></header>
    <div class="grid gap-space-xl">
      <Card title="非受控" description="只读输入框聚焦后打开树，选择节点后回填标签，并支持清除。"><DemoSelect treeData={departmentTreeData} defaultValue="frontend" /></Card>
      <Card title="受控与回显" description="选中值由应用管理。"><DemoSelect treeData={departmentTreeData} value={controlled()} onChange={(value) => setControlled(value as TreeSelectValue)} /><p class="mt-space-sm text-sm">当前值：{controlled()}</p></Card>
      <Card title="多选与选中反馈" description="复选框反馈勾选状态，选中与勾选状态互相独立。"><DemoSelect treeData={departmentTreeData} multiple defaultValue={['frontend', 'research']} /></Card>
      <Card title="同步搜索" description="复用 Tree 的 searchFeature，并高亮匹配文字。"><DemoSelect treeData={syncData()} searchable searchValue={keyword()} onSearch={setKeyword} /></Card>
      <Card title="异步单选搜索与路径树回显" description="服务端返回带路径结果；选择后加载路径树并回填标签。"><DemoSelect treeData={asyncTreeData()} searchable value={selected()} searchValue={asyncKeyword()} contentActive={mode() === 'search' || mode() === 'locating'} expandedKeys={asyncExpanded()} onExpandedKeysChange={setAsyncExpanded} asyncLoader={loadChildren} onTreeDataChange={(nodes) => located().length ? setLocated(toDemo(nodes)) : setRoots(toDemo(nodes))} onSearch={search} onChange={(value) => setSelected(value as TreeSelectValue)} onClear={clearSingle}>{mode() === 'search' ? <ListboxRoot items={results()} getItemValue={(item) => item.node.id}><For each={results()}>{(result) => <TreeSelectOption item={{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }}>{({ select }) => <ListboxItem value={result.node.id} disabled={result.node.disabled} class={resultClass} onSelect={() => choose(result, select)}><span><span class="block text-sm font-medium">{result.node.name}</span><span class="block text-xs text-muted-foreground">{result.path.map((part) => part.label).join(' / ')}</span></span></ListboxItem>}</TreeSelectOption>}</For></ListboxRoot> : <p class="px-space-sm py-space-xs text-sm text-muted-foreground">正在加载路径树…</p>}</DemoSelect></Card>
      <Card title="异步多选搜索" description="选中项跨搜索词保留，结果列表支持连续勾选。"><DemoSelect treeData={rootTreeData()} multiple value={multiValues()} searchable searchValue={multiKeyword()} contentActive={multiResultsVisible()} expandedKeys={multiExpanded()} onExpandedKeysChange={setMultiExpanded} asyncLoader={loadChildren} onTreeDataChange={(nodes) => setRoots(toDemo(nodes))} onSearch={searchMultiple} onChange={(value) => setMultiValues((value as TreeSelectValue[]) ?? [])} onClear={clearMultiple}><ListboxRoot multiple value={multiValues()} items={multiResults()} getItemValue={(item) => item.node.id}><For each={multiResults()}>{(result) => <TreeSelectOption toggle clearSearchOnSelect={false} item={{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }}>{(option) => <ListboxItem value={result.node.id} disabled={result.node.disabled} onSelect={option.select} class={resultClass}><Checkbox checked={multiValues().includes(result.node.id)} disabled={result.node.disabled} /><span><span class="block text-sm font-medium">{result.node.name}</span><span class="block text-xs text-muted-foreground">{result.path.map((part) => part.label).join(' / ')}</span></span></ListboxItem>}</TreeSelectOption>}</For></ListboxRoot></DemoSelect></Card>
      <Card title="异步多选搜索：裁剪树" description="后端只返回命中节点及其祖先。局部结果无法代表未加载的完整后代，因此使用严格勾选，父子不联动。"><DemoSelect treeData={convert(treeKeyword() ? croppedTree() : roots())} multiple checkStrictly value={treeValues()} searchable searchValue={treeKeyword()} onSearch={searchTree} onChange={(value) => setTreeValues((value as TreeSelectValue[]) ?? [])} onClear={() => { setTreeKeyword(''); setCroppedTree([]); setTreeExpanded([]) }} expandedKeys={treeExpanded()} onExpandedKeysChange={setTreeExpanded} asyncLoader={treeKeyword() ? undefined : loadChildren} onTreeDataChange={treeKeyword() ? undefined : (nodes) => setRoots(toDemo(nodes))} /></Card>
      <Card title="异步值回显" description="一次解析根节点、分支节点和叶节点三个不同层级的已有值。"><DemoSelect treeData={echoTreeData()} multiple checkStrictly defaultValue={echoValues} expandedKeys={echoExpanded()} onExpandedKeysChange={setEchoExpanded} asyncLoader={loadChildren} onTreeDataChange={(nodes) => setEchoTree(toDemo(nodes))} onClear={() => { setEchoTree([...roots()]); setEchoExpanded([]) }} /></Card>
    </div>
  </div></main>
}
