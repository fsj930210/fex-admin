<script setup lang="ts">
import { expansionFeature, searchFeature } from '@fex/components-core'
import { createTreeController } from '@fex/components-core/tree/create-tree-controller'
import type { SearchFeatureApi } from '@fex/components-core/tree/features/search'
import { Input } from '@fex/components-vue/primitive/input'
import Card from '@fex/components-vue/ui/card'
import { computed, ref } from 'vue'
import DemoTree from './demo-tree.vue'
import { departmentFieldNames, departmentTreeData, type DepartmentNode } from './data'

const searchController = createTreeController<DepartmentNode>({
  treeData: departmentTreeData,
  fieldNames: departmentFieldNames,
  isLeaf: (node) => node.childCount === 0,
  features: [
    expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
    searchFeature(),
  ],
})
const keyword = ref('')
const subtree = computed(
  () =>
    searchController.getFeature<SearchFeatureApi<DepartmentNode>>('search')?.getSubtree({
      keyword: keyword.value,
      filterTreeNode: (node, value) => node.name.toLowerCase().includes(value.toLowerCase()),
    }) ?? [],
)
const showingSearchTree = computed(() => Boolean(keyword.value.trim()))
const treeFeatures = [
  expansionFeature({ defaultExpandedKeys: ['company', 'engineering', 'product'] }),
]

function handleInput(event: Event) {
  keyword.value = (event.target as HTMLInputElement).value
}

function parts(title: string) {
  const index = title.toLowerCase().indexOf(keyword.value.toLowerCase())
  return index < 0
    ? { before: title, match: '', after: '' }
    : {
        before: title.slice(0, index),
        match: title.slice(index, index + keyword.value.length),
        after: title.slice(index + keyword.value.length),
      }
}
</script>

<template>
  <Card
    title="Search data and custom title rendering"
    description="The core returns filtered tree data; title rendering decides how a keyword is highlighted."
  >
    <Input
      :value="keyword"
      placeholder="Search departments"
      class="mb-space-md max-w-sm"
      @input="handleInput"
    />
    <div v-show="!showingSearchTree">
      <!-- @vue-generic {DepartmentNode} -->
      <DemoTree
        :controller="searchController"
        :tree-data="departmentTreeData"
        :field-names="departmentFieldNames"
        :is-leaf="(node) => node.childCount === 0"
        :features="treeFeatures"
        class="max-w-xl rounded-md border border-border bg-background p-space-sm"
      />
    </div>
    <!-- @vue-generic {DepartmentNode} -->
    <DemoTree
      v-if="showingSearchTree"
      :tree-data="subtree"
      :field-names="departmentFieldNames"
      :is-leaf="(node) => node.childCount === 0"
      :features="treeFeatures"
      :search-keyword="keyword"
      class="max-w-xl rounded-md border border-border bg-background p-space-sm"
    >
      <template #title="{ item }">
        {{ parts(String(item.node.name)).before }}<mark
          class="rounded-sm bg-warning/20 px-0.5 text-inherit"
        >{{ parts(String(item.node.name)).match }}</mark>{{ parts(String(item.node.name)).after }}
      </template>
    </DemoTree>
  </Card>
</template>
