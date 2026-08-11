import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core'
import { RouterLink } from '@angular/router'
import { asyncLoadFeature, checkFeature, expansionFeature, selectionFeature } from '@fex-design/core'
import { getSearchSubtree } from '@fex-design/core/tree/get-search-subtree'
import type { TreeKey, TreeOptions } from '@fex-design/core/tree/types'
import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { InputClear, InputControl, InputRoot } from '@fex-design/angular/primitive/input'
import { Tag } from '@fex-design/angular/primitive/tag'
import { TreeSelectContent, TreeSelectOption, TreeSelectPortal, TreeSelectRoot, TreeSelectTrigger } from '@fex-design/angular/primitive/tree-select'
import Card from '@fex-design/angular/ui/card'
import { Checkbox } from '@fex-design/angular/ui/checkbox'
import { getDemoTreeChildren, getDemoTreeExpandedKeys, getDemoTreeRoots, getDemoTreeSubtree, getDemoTreeSubtrees, searchDemoTree, searchDemoTreeAsTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { DemoTreeComponent } from '../tree/demo-tree.component'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from '../tree/data'

function convert(nodes: readonly DemoDepartmentNode[]): DepartmentNode[] { return nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.children ? { childrenList: convert(node.children) } : {}) })) }
function findNode(nodes: readonly DepartmentNode[], key: TreeKey): DepartmentNode | undefined { for (const node of nodes) { if (node.id === key) return node; const child = findNode(node.childrenList ?? [], key); if (child) return child } return undefined }
function toItems(nodes: readonly DepartmentNode[]): TreeSelectItem<DepartmentNode>[] { return nodes.flatMap((node) => [{ value: node.id, label: node.name, node }, ...toItems(node.childrenList ?? [])]) }

@Component({
  selector: 'fex-tree-select-page',
  standalone: true,
  imports: [RouterLink, Card, Checkbox, Tag, DemoTreeComponent, InputRoot, InputControl, InputClear, TreeSelectRoot, TreeSelectTrigger, TreeSelectPortal, TreeSelectContent, TreeSelectOption],
  host: { class: 'block' },
  templateUrl: './index.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TreeSelectComponent {
  readonly maxTagCount = 2
  readonly basic = viewChild<TreeSelectRoot<DepartmentNode>>('basic')
  readonly controlledRoot = viewChild<TreeSelectRoot<DepartmentNode>>('controlledRoot')
  readonly multipleRoot = viewChild<TreeSelectRoot<DepartmentNode>>('multipleRoot')
  readonly syncRoot = viewChild<TreeSelectRoot<DepartmentNode>>('syncRoot')
  readonly asyncRoot = viewChild<TreeSelectRoot<DepartmentNode>>('asyncRoot')
  readonly asyncMultipleRoot = viewChild<TreeSelectRoot<DepartmentNode>>('asyncMultipleRoot')
  readonly echoRoot = viewChild<TreeSelectRoot<DepartmentNode>>('echoRoot')
  readonly croppedRoot = viewChild<TreeSelectRoot<DepartmentNode>>('croppedRoot')
  readonly controlled = signal<TreeSelectValue | undefined>('platform')
  readonly items = toItems(departmentTreeData)
  readonly keyword = signal('')
  readonly asyncKeyword = signal('')
  readonly roots = signal<DepartmentNode[]>([])
  readonly located = signal<DepartmentNode[]>([])
  readonly asyncMode = signal<'browse' | 'search' | 'locating' | 'located'>('browse')
  readonly asyncExpandedKeys = signal<readonly TreeKey[]>([])
  readonly echoTree = signal<DepartmentNode[]>([])
  readonly echoExpandedKeys = signal<readonly TreeKey[]>([])
  readonly results = signal<DemoTreeSearchResult[]>([])
  readonly asyncValue = signal<TreeSelectValue | undefined>(undefined)
  readonly multiKeyword = signal(''); readonly multiResults = signal<DemoTreeSearchResult[]>([]); readonly multiValues = signal<TreeSelectValue[]>([]); readonly multiShowResults = signal(false); readonly multiExpandedKeys = signal<readonly TreeKey[]>([])
  readonly treeKeyword = signal(''); readonly croppedTree = signal<DepartmentNode[]>([]); readonly treeValues = signal<TreeSelectValue[]>([])
  readonly croppedExpandedKeys = signal<readonly TreeKey[]>([])
  readonly echoValues = ['company', 'finance', 'design-system']
  private searchRequest?: AbortController
  private multiRequest?: AbortController
  private treeRequest?: AbortController
  readonly syncData = computed(() => getSearchSubtree(departmentTreeData, departmentFieldNames, { keyword: this.keyword(), filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()) }))
  readonly basicOptions = this.options(departmentTreeData, (key) => this.select(this.basic(), departmentTreeData, key), ['frontend'])
  readonly controlledOptions = computed(() => this.options(departmentTreeData, (key) => { this.controlled.set(key); this.select(this.controlledRoot(), departmentTreeData, key) }, undefined, this.controlled() === undefined ? [] : [this.controlled()!]))
  readonly multipleOptions: TreeOptions<DepartmentNode> = { treeData: departmentTreeData, fieldNames: departmentFieldNames, features: [expansionFeature({ defaultExpandedKeys: ['company'] }), checkFeature({ defaultCheckedKeys: ['frontend', 'research'] })], onCheckedKeysChange: (_keys, meta) => meta.changedKeys.forEach((key) => this.toggle(this.multipleRoot(), departmentTreeData, key)) }
  readonly syncOptions = computed(() => this.options(this.syncData(), (key) => {
    this.select(this.syncRoot(), departmentTreeData, key)
    this.keyword.set('')
  }))
  readonly asyncOptions = computed(() => this.asyncTreeOptions(this.located().length ? this.located() : this.roots(), this.asyncExpandedKeys(), (keys) => this.asyncExpandedKeys.set(keys), (nodes) => this.located().length ? this.located.set([...nodes]) : this.roots.set([...nodes]), (key) => this.select(this.asyncRoot(), this.located().length ? this.located() : this.roots(), key), false, this.asyncValue()))
  readonly asyncMultipleOptions = computed(() => this.asyncTreeOptions(this.roots(), this.multiExpandedKeys(), (keys) => this.multiExpandedKeys.set(keys), (nodes) => this.roots.set([...nodes]), (key) => this.toggle(this.asyncMultipleRoot(), this.roots(), key), true))
  readonly croppedOptions = computed(() => this.strictOptions(this.treeKeyword() ? this.croppedTree() : this.roots(), this.treeValues(), (keys) => { this.treeValues.set([...keys]); this.croppedRoot()?.controller.setValues(keys) }, this.croppedExpandedKeys(), (keys) => this.croppedExpandedKeys.set(keys), !this.treeKeyword(), (nodes) => this.roots.set([...nodes])))
  readonly echoOptions = computed(() => this.strictOptions(this.echoTree(), this.echoRoot()?.snapshot().values ?? this.echoValues, (keys) => this.echoRoot()?.controller.setValues(keys), this.echoExpandedKeys(), (keys) => this.echoExpandedKeys.set(keys), true, (nodes) => this.echoTree.set([...nodes])))
  readonly asyncItems = computed(() => toItems(this.located().length ? this.located() : this.roots()))
  readonly echoItems = computed(() => toItems(this.echoTree()))

  constructor() {
    void getDemoTreeRoots().then((nodes) => this.roots.set(convert(nodes)))
    void getDemoTreeSubtrees(this.echoValues).then((response) => {
      const nodes = convert(response.treeData); this.echoTree.set(nodes); this.echoExpandedKeys.set(response.expandedKeys)
      for (const key of response.targetKeys) { const node = findNode(nodes, key); if (node) this.echoRoot()?.controller.registerItem({ value: node.id, label: node.name, node }) }
    })
  }
  private options(treeData: readonly DepartmentNode[], onSelect: (key: TreeKey) => void, defaultSelectedKeys?: readonly TreeKey[], selectedKeys?: readonly TreeKey[]): TreeOptions<DepartmentNode> { return { treeData, fieldNames: departmentFieldNames, isLeaf: (node) => node.childCount === 0, features: [expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'finance', 'product'] }), selectionFeature()], ...(defaultSelectedKeys ? { defaultSelectedKeys } : {}), ...(selectedKeys ? { selectedKeys } : {}), onSelectedKeysChange: (keys, meta) => { const key = meta.changedKeys.find((item) => keys.includes(item)); if (key !== undefined) onSelect(key) } } }
  private asyncTreeOptions(treeData: readonly DepartmentNode[], expandedKeys: readonly TreeKey[], onExpandedKeysChange: (keys: readonly TreeKey[]) => void, onTreeDataChange: (nodes: readonly DepartmentNode[]) => void, onSelect: (key: TreeKey) => void, multiple = false, selectedValue?: TreeSelectValue): TreeOptions<DepartmentNode> {
    const loadChildren = async (item: { key: TreeKey }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
    return { treeData, fieldNames: departmentFieldNames, isLeaf: (node) => node.childCount === 0, expandedKeys, onExpandedKeysChange, onTreeDataChange, features: [expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren }), ...(multiple ? [checkFeature<DepartmentNode>()] : [selectionFeature<DepartmentNode>()])], ...(multiple ? { checkedKeys: this.multiValues(), onCheckedKeysChange: (keys) => { this.multiValues.set([...keys]); this.asyncMultipleRoot()?.controller.setValues(keys) } } : { selectedKeys: selectedValue === undefined ? [] : [selectedValue], onSelectedKeysChange: (keys, meta) => { const key = meta.changedKeys.find((item) => keys.includes(item)); if (key !== undefined) onSelect(key) } }) }
  }
  private strictOptions(treeData: readonly DepartmentNode[], checkedKeys: readonly TreeKey[], onCheckedKeysChange: (keys: readonly TreeKey[]) => void, expandedKeys?: readonly TreeKey[], onExpandedKeysChange?: (keys: readonly TreeKey[]) => void, asyncLoading = false, onTreeDataChange?: (nodes: readonly DepartmentNode[]) => void): TreeOptions<DepartmentNode> {
    const loadChildren = async (item: { key: TreeKey }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
    return { treeData, fieldNames: departmentFieldNames, isLeaf: (node) => node.childCount === 0, features: [expansionFeature(), ...(asyncLoading ? [asyncLoadFeature<DepartmentNode>({ loadChildren })] : []), checkFeature({ mode: 'strict' })], checkedKeys, onCheckedKeysChange: (keys, meta) => { const next = new Set(checkedKeys); meta.changedKeys.forEach((key) => keys.includes(key) ? next.add(key) : next.delete(key)); onCheckedKeysChange([...next]) }, ...(expandedKeys ? { expandedKeys } : {}), ...(onExpandedKeysChange ? { onExpandedKeysChange } : {}), ...(onTreeDataChange ? { onTreeDataChange } : {}) }
  }
  private select(root: TreeSelectRoot<DepartmentNode> | undefined, nodes: readonly DepartmentNode[], key: TreeKey) { const node = findNode(nodes, key); if (node) root?.select({ value: key, label: node.name, node }, false) }
  private toggle(root: TreeSelectRoot<DepartmentNode> | undefined, nodes: readonly DepartmentNode[], key: TreeKey) { const node = findNode(nodes, key); if (node) root?.select({ value: key, label: node.name, node }, true) }
  search(value: string) { this.asyncKeyword.set(value); this.searchRequest?.abort(); if (!value.trim()) { this.asyncValue.set(undefined); this.results.set([]); this.located.set([]); this.asyncExpandedKeys.set([]); this.asyncMode.set('browse'); return } this.asyncMode.set('search'); const request = new AbortController(); this.searchRequest = request; void searchDemoTree(value, request.signal).then((items) => this.results.set(items)) }
  searchMultiple(value: string) { this.multiKeyword.set(value); this.multiRequest?.abort(); if (!value.trim()) { this.multiResults.set([]); this.multiShowResults.set(false); return } this.multiShowResults.set(true); const request = new AbortController(); this.multiRequest = request; void searchDemoTree(value, request.signal).then((items) => this.multiResults.set(items)) }
  searchTree(value: string) { this.treeKeyword.set(value); this.treeRequest?.abort(); if (!value.trim()) { this.croppedTree.set([]); this.croppedExpandedKeys.set([]); return } this.treeRequest = new AbortController(); void searchDemoTreeAsTree(value, this.treeRequest.signal).then((items) => { this.croppedTree.set(convert(items)); this.croppedExpandedKeys.set(getDemoTreeExpandedKeys(items)) }).catch((error) => { if (error.name !== 'AbortError') throw error }) }
  choose(result: DemoTreeSearchResult) { if (result.node.disabled) return; this.asyncValue.set(result.node.id); this.asyncKeyword.set(''); this.results.set([]); this.asyncMode.set('locating'); void getDemoTreeSubtree(result.node.id).then((response) => { this.located.set(convert(response.treeData)); this.asyncExpandedKeys.set(response.expandedKeys); this.asyncMode.set('located') }) }
  chooseMultiple(result: DemoTreeSearchResult) { if (result.node.disabled) return; this.asyncMultipleRoot()?.select({ value: result.node.id, label: result.node.name, node: result.node, path: result.path }, true, false, false); this.multiKeyword.set('') }
  clearAsync() { this.asyncRoot()?.clear(); this.asyncKeyword.set(''); this.asyncValue.set(undefined); this.results.set([]); this.located.set([]); this.asyncExpandedKeys.set([]); this.asyncMode.set('browse') }
  clearMultiple() { this.asyncMultipleRoot()?.clear(); this.multiKeyword.set(''); this.multiResults.set([]); this.multiShowResults.set(false); this.multiValues.set([]) }
  clearEcho() { this.echoRoot()?.clear(); this.echoTree.set([...this.roots()]); this.echoExpandedKeys.set([]) }
  clear(root: TreeSelectRoot<any>) { root.clear() }
  isSelected(root: TreeSelectRoot<any>, value: TreeSelectValue) { root.snapshot(); return root.controller.isSelected(value) }
  setControlled(value: TreeSelectValue | TreeSelectValue[] | undefined) { if (!Array.isArray(value)) this.controlled.set(value) }
  setMultiple(value: TreeSelectValue | TreeSelectValue[] | undefined) { this.multiValues.set(Array.isArray(value) ? value : value === undefined ? [] : [value]) }
  visibleSelected(root: TreeSelectRoot<any>) { const items = root.snapshot().selectedItems; return items.length <= this.maxTagCount ? items : [] }
  removeSelected(event: Event, root: TreeSelectRoot<any>, value: TreeSelectValue) { event.preventDefault(); event.stopPropagation(); root.controller.setValues(root.snapshot().values.filter((item) => item !== value)) }
}
