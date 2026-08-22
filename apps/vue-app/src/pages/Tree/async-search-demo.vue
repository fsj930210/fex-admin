<script setup lang="ts">
import { expansionFeature, selectionFeature } from '@fex-design/core'
import { InputClear, InputControl, InputRoot } from '@fex-design/vue/primitive/input'
import { ListboxItem, ListboxRoot } from '@fex-design/vue/primitive/listbox'
import Card from '@fex-design/vue/ui/card'
import { getDemoTreeSubtree, searchDemoTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { ref } from 'vue'
import DemoTree from './demo-tree.vue'
import { departmentFieldNames, type DepartmentNode } from './data'
const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map(node => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.children ? { childrenList: convert(node.children) } : {}) }))
const keyword = ref(''), results = ref<DemoTreeSearchResult[]>([]), treeData = ref<DepartmentNode[]>([]), selected = ref('')
let request: AbortController | undefined
async function search(value: string) { keyword.value = value; request?.abort(); if (!value.trim()) { results.value = []; return } request = new AbortController(); results.value = await searchDemoTree(value, request.signal) }
async function choose(result: DemoTreeSearchResult) { selected.value = result.node.id; keyword.value = ''; treeData.value = convert((await getDemoTreeSubtree(result.node.id)).treeData) }
function clear() { keyword.value = ''; results.value = []; treeData.value = []; selected.value = '' }
</script>
<template><Card title="Async search and locate" description="The real server returns path-aware matches, then an ancestor subtree.">
  <InputRoot :value="keyword || results.find(item => item.node.id === selected)?.node.name || selected" class="mb-space-md max-w-sm" @value-change="search" @clear="clear"><InputControl placeholder="Search remote departments" /><InputClear /></InputRoot>
  <ListboxRoot v-if="keyword" :items="results" :get-item-value="(item: unknown) => (item as DemoTreeSearchResult).node.id"><ListboxItem v-for="result in results" :key="result.node.id" :value="result.node.id" class="cursor-pointer rounded-md px-space-sm py-space-xs" @select="choose(result)"><span class="block text-sm font-medium">{{ result.node.name }}</span><span class="block text-xs text-muted-foreground">{{ result.path.map(part => part.label).join(' / ') }}</span></ListboxItem></ListboxRoot>
  <DemoTree v-else-if="treeData.length" :tree-data="treeData" :field-names="departmentFieldNames" :selected-keys="selected ? [selected] : []" :features="[expansionFeature<DepartmentNode>({ defaultExpandedKeys: ['company','engineering','finance','product'] }), selectionFeature<DepartmentNode>()]" />
</Card></template>
