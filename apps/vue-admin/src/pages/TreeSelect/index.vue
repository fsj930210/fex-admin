<script setup lang="ts">
import { searchFeature } from '@fex-design/core'
import { createTreeController } from '@fex-design/core/tree/create-tree-controller'
import type { SearchFeatureApi } from '@fex-design/core/tree/features/search'
import type { TreeKey } from '@fex-design/core/tree/types'
import type { TreeSelectValue } from '@fex-design/core/tree-select/types'
import { ListboxItem, ListboxRoot } from '@fex-design/vue/primitive/listbox'
import { TreeSelectOption } from '@fex-design/vue/primitive/tree-select'
import Card from '@fex-design/vue/ui/card'
import Checkbox from '@fex-design/vue/ui/checkbox'
import { getDemoTreeChildren, getDemoTreeExpandedKeys, getDemoTreeRoots, getDemoTreeSubtree, getDemoTreeSubtrees, searchDemoTree, searchDemoTreeAsTree, type DemoDepartmentNode, type DemoTreeSearchResult } from '@fex/mock/tree-api'
import { computed, onMounted, ref } from 'vue'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from '../Tree/data'
import DemoTreeSelect from './demo-tree-select.vue'

const controlled = ref<TreeSelectValue>('platform')
const keyword = ref('')
const syncController = createTreeController<DepartmentNode>({ treeData: departmentTreeData, fieldNames: departmentFieldNames, features: [searchFeature()] })
const syncData = computed(() => keyword.value ? syncController.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({ keyword: keyword.value, filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()) }) ?? [] : departmentTreeData)
const roots = ref<DemoDepartmentNode[]>([])
const asyncKeyword = ref('')
const results = ref<DemoTreeSearchResult[]>([])
const selected = ref<TreeSelectValue>()
const located = ref<DemoDepartmentNode[]>([])
const asyncMode = ref<'browse' | 'search' | 'locating' | 'located'>('browse')
const asyncExpandedKeys = ref<readonly TreeKey[]>([])
const echoTree = ref<DemoDepartmentNode[]>([])
const echoExpandedKeys = ref<readonly TreeKey[]>([])
let request: AbortController | undefined
const multiKeyword = ref(''), multiResults = ref<DemoTreeSearchResult[]>([]), multiValues = ref<TreeSelectValue[]>([])
const multiShowResults = ref(false)
const multiExpandedKeys = ref<readonly TreeKey[]>([])
const treeKeyword = ref(''), croppedTree = ref<DemoDepartmentNode[]>([]), treeValues = ref<TreeSelectValue[]>([])
const treeExpandedKeys = ref<readonly TreeKey[]>([])
let multiRequest: AbortController | undefined
let treeRequest: AbortController | undefined
const echoValues = ['company', 'finance', 'design-system']
onMounted(async () => { roots.value = await getDemoTreeRoots(); const echo = await getDemoTreeSubtrees(echoValues); echoTree.value = echo.treeData; echoExpandedKeys.value = echo.expandedKeys })
function convert(nodes: readonly DemoDepartmentNode[]): DepartmentNode[] { return nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.children ? { childrenList: convert(node.children) } : {}) })) }
function toDemo(nodes: readonly DepartmentNode[]): DemoDepartmentNode[] { return nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }), ...(node.childrenList ? { children: toDemo(node.childrenList) } : {}) })) }
async function search(value: string) { asyncKeyword.value = value; request?.abort(); if (!value.trim()) { selected.value = undefined; results.value = []; located.value = []; asyncExpandedKeys.value = []; asyncMode.value = 'browse'; return } asyncMode.value = 'search'; request = new AbortController(); results.value = await searchDemoTree(value, request.signal) }
async function choose(result: DemoTreeSearchResult, select: () => void) { select(); selected.value = result.node.id; asyncKeyword.value = ''; results.value = []; asyncMode.value = 'locating'; const response = await getDemoTreeSubtree(result.node.id); located.value = response.treeData; asyncExpandedKeys.value = response.expandedKeys; asyncMode.value = 'located' }
async function searchMultiple(value: string) { multiKeyword.value = value; multiRequest?.abort(); if (!value.trim()) { multiResults.value = []; multiShowResults.value = false; return } multiShowResults.value = true; multiRequest = new AbortController(); multiResults.value = await searchDemoTree(value, multiRequest.signal) }
function clearAsync() { selected.value = undefined; asyncKeyword.value = ''; results.value = []; located.value = []; asyncExpandedKeys.value = []; asyncMode.value = 'browse' }
function clearMultiple() { multiValues.value = []; multiKeyword.value = ''; multiResults.value = []; multiShowResults.value = false }
async function searchTree(value: string) { treeKeyword.value = value; treeRequest?.abort(); if (!value.trim()) { croppedTree.value = []; treeExpandedKeys.value = []; return } treeRequest = new AbortController(); try { const nodes = await searchDemoTreeAsTree(value, treeRequest.signal); croppedTree.value = nodes; treeExpandedKeys.value = getDemoTreeExpandedKeys(nodes) } catch (error) { if ((error as Error).name !== 'AbortError') throw error } }
const loadChildren = async (item: { key: TreeKey }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
</script>
<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto grid w-full max-w-5xl gap-space-xl">
    <header class="space-y-space-sm"><RouterLink class="text-sm text-muted-foreground" to="/">返回首页</RouterLink><h1 class="text-2xl font-semibold">TreeSelect 树选择</h1><p class="text-sm text-muted-foreground">由输入框、弹出层和树组合而成，搜索请求与结果渲染由使用方控制。</p></header>
    <div class="grid gap-space-xl">
      <Card title="非受控" description="只读输入框打开树，并回填选中节点的标签。"><DemoTreeSelect :tree-data="departmentTreeData" default-value="frontend" /></Card>
      <Card title="受控与回显" description="选中值由应用管理。"><DemoTreeSelect :tree-data="departmentTreeData" :value="controlled" @change="controlled = $event as TreeSelectValue" /><p class="mt-space-sm text-sm">当前值：{{ controlled }}</p></Card>
      <Card title="多选" description="建议使用复选框提供选中反馈，同时支持自定义选中状态的展示。"><DemoTreeSelect :tree-data="departmentTreeData" multiple :default-value="['frontend', 'research']" /></Card>
      <Card title="同步搜索" description="在面板内复用 Tree 的 searchFeature。"><DemoTreeSelect :tree-data="syncData" searchable :search-value="keyword" @search="keyword = $event" /></Card>
      <Card title="异步单选搜索与路径树回显" description="真实服务端返回带路径的结果；选择后加载祖先路径树并回填标签。">
        <DemoTreeSelect :tree-data="convert(located.length ? located : roots)" searchable :value="selected" :search-value="asyncKeyword" :content-active="asyncMode === 'search' || asyncMode === 'locating'" :expanded-keys="asyncExpandedKeys" :async-loader="loadChildren" :on-tree-data-change="(nodes) => located.length ? located = toDemo(nodes) : roots = toDemo(nodes)" @expanded-keys-change="asyncExpandedKeys = $event" @search="search" @change="selected = $event as TreeSelectValue" @clear="clearAsync">
          <ListboxRoot v-if="asyncMode === 'search'" :items="results" :get-item-value="(item: unknown) => (item as DemoTreeSearchResult).node.id">
            <TreeSelectOption v-for="result in results" :key="result.node.id" :item="{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }" v-slot="option">
              <ListboxItem :value="result.node.id" :disabled="result.node.disabled" class="cursor-pointer rounded-md px-space-sm py-space-xs data-[selected=true]:bg-accent data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50" @select="choose(result, option.select)"><span class="block text-sm font-medium">{{ result.node.name }}</span><span class="block text-xs text-muted-foreground">{{ result.path.map(part => part.label).join(' / ') }}</span></ListboxItem>
            </TreeSelectOption>
          </ListboxRoot>
          <p v-else class="px-space-sm py-space-xs text-sm text-muted-foreground">正在加载路径树…</p>
        </DemoTreeSelect>
      </Card>
      <Card title="异步多选搜索" description="选中项会跨搜索词保留，复选框用于展示已有选择。">
        <DemoTreeSelect :tree-data="convert(roots)" multiple :value="multiValues" searchable :search-value="multiKeyword" :content-active="multiShowResults" :expanded-keys="multiExpandedKeys" :async-loader="loadChildren" :on-tree-data-change="(nodes) => roots = toDemo(nodes)" @expanded-keys-change="multiExpandedKeys = $event" @search="searchMultiple" @change="multiValues = ($event as TreeSelectValue[]) ?? []" @clear="clearMultiple">
          <ListboxRoot v-if="multiShowResults" multiple :items="multiResults" :value="multiValues" :get-item-value="(item: unknown) => (item as DemoTreeSearchResult).node.id">
            <TreeSelectOption v-for="result in multiResults" :key="result.node.id" toggle :clear-search-on-select="false" :item="{ value: result.node.id, label: result.node.name, node: result.node, path: result.path, disabled: result.node.disabled }" v-slot="option"><ListboxItem :value="result.node.id" :disabled="result.node.disabled" class="flex cursor-pointer items-center gap-space-sm rounded-md px-space-sm py-space-xs data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50" @select="option.select"><Checkbox :checked="option.selected" :disabled="result.node.disabled" /><span><span class="block text-sm font-medium">{{ result.node.name }}</span><span class="block text-xs text-muted-foreground">{{ result.path.map(part => part.label).join(' / ') }}</span></span></ListboxItem></TreeSelectOption>
          </ListboxRoot>
        </DemoTreeSelect>
      </Card>
      <Card title="异步多选搜索：裁剪树" description="后端只返回命中节点及其祖先。局部结果无法代表未加载的完整后代，因此使用严格勾选，父子不联动。"><DemoTreeSelect :tree-data="convert(treeKeyword ? croppedTree : roots)" multiple check-strictly :value="treeValues" searchable :search-value="treeKeyword" :expanded-keys="treeExpandedKeys" :async-loader="treeKeyword ? undefined : loadChildren" :on-tree-data-change="treeKeyword ? undefined : (nodes) => roots = toDemo(nodes)" @expanded-keys-change="treeExpandedKeys = $event" @search="searchTree" @change="treeValues = ($event as TreeSelectValue[]) ?? []" @clear="treeKeyword = ''; croppedTree = []; treeExpandedKeys = []" /></Card>
      <Card title="异步值回显" description="一次解析根节点、分支节点和叶节点三个不同层级的已有值。"><DemoTreeSelect :tree-data="convert(echoTree)" multiple check-strictly :default-value="echoValues" :expanded-keys="echoExpandedKeys" :async-loader="loadChildren" :on-tree-data-change="(nodes) => echoTree = toDemo(nodes)" @expanded-keys-change="echoExpandedKeys = $event" @clear="echoTree = [...roots]; echoExpandedKeys = []" /></Card>
    </div>
  </div></main>
</template>
