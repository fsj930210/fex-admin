import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core'
import { expansionFeature, selectionFeature } from '@fex-design/core'
import type { TreeOptions } from '@fex-design/core/tree/types'
import { InputClear, InputControl, InputRoot } from '@fex-design/angular/primitive/input'
import { ListboxItem, ListboxRoot } from '@fex-design/angular/primitive/listbox'
import Card from '@fex-design/angular/ui/card'
import { getDemoTreeSubtree, searchDemoTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { DemoTreeComponent } from './demo-tree.component'
import { departmentFieldNames, type DepartmentNode } from './data'
const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.children ? { childrenList: convert(node.children) } : {}) }))
@Component({ selector: 'fex-async-search-tree-demo', standalone: true, imports: [Card, InputRoot, InputControl, InputClear, ListboxRoot, ListboxItem, DemoTreeComponent], templateUrl: './async-search-demo.component.html', changeDetection: ChangeDetectionStrategy.OnPush })
export class AsyncSearchTreeDemoComponent {
  readonly keyword = signal(''); readonly results = signal<DemoTreeSearchResult[]>([]); readonly treeData = signal<DepartmentNode[]>([]); readonly selected = signal('')
  private request?: AbortController
  readonly inputValue = computed(() => this.keyword() || this.results().find(item => item.node.id === this.selected())?.node.name || this.selected())
  readonly options = computed<TreeOptions<DepartmentNode>>(() => ({ treeData: this.treeData(), fieldNames: departmentFieldNames, selectedKeys: this.selected() ? [this.selected()] : [], features: [expansionFeature({ defaultExpandedKeys: ['company','engineering','finance','product'] }), selectionFeature()] }))
  search(value: string) { this.keyword.set(value); this.request?.abort(); if (!value.trim()) { this.results.set([]); return } const request = new AbortController(); this.request = request; void searchDemoTree(value, request.signal).then(items => this.results.set(items)) }
  choose(result: DemoTreeSearchResult) { this.selected.set(result.node.id); this.keyword.set(''); void getDemoTreeSubtree(result.node.id).then(data => this.treeData.set(convert(data.treeData))) }
  clear() { this.keyword.set(''); this.results.set([]); this.treeData.set([]); this.selected.set('') }
}
