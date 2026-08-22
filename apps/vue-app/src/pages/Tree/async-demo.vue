<script setup lang="ts">
import { asyncLoadFeature, expansionFeature } from '@fex-design/core'
import Card from '@fex-design/vue/ui/card'
import DemoTree from './demo-tree.vue'
import { departmentFieldNames, type DepartmentNode } from './data'
import { getDemoTreeChildren, getDemoTreeRoots, type DemoDepartmentNode } from '@fex/mock/tree-api'
import { onMounted, ref } from 'vue'
const convert = (nodes: readonly DemoDepartmentNode[]): DepartmentNode[] => nodes.map((node) => ({ id: node.id, name: node.name, childCount: node.childCount, ...(node.disabled === undefined ? {} : { disabled: node.disabled }) }))
const asyncTreeData = ref<DepartmentNode[]>([])
const loadChildren = async (item: { key: string | number }, context: { signal: AbortSignal }) => convert(await getDemoTreeChildren(item.key, context.signal))
onMounted(async () => { asyncTreeData.value = convert(await getDemoTreeRoots()) })
</script>
<template>
  <Card
    title="Async children"
    description="A node without children can still expand when isLeaf says it may have descendants."
    ><DemoTree
      :tree-data="asyncTreeData"
      :field-names="departmentFieldNames"
      :is-leaf="(n) => n.childCount === 0"
      :features="[expansionFeature(), asyncLoadFeature<DepartmentNode>({ loadChildren })]"
      class="max-w-xl rounded-md border border-border bg-background p-space-sm"
  /></Card>
</template>
