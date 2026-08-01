<script setup lang="ts">
import { checkFeature, expansionFeature } from '@fex/components-core'
import type { TransferPanelApi } from '@fex/components-vue/primitive/transfer'
import { computed } from 'vue'
import DemoTree from '../Tree/demo-tree.vue'
import type { Member } from './data'
const props = defineProps<{ api: TransferPanelApi<Member> }>()
const treeData = computed(() =>
  Array.from(new Set(props.api.items.map((item) => item.department))).map((department) => ({
    id: `department:${department}`,
    name: department,
    children: props.api.items.filter((item) => item.department === department),
  })),
)
const features = computed(() => [
  expansionFeature({ defaultExpandedKeys: treeData.value.map((item) => item.id) }),
  checkFeature(),
])
</script>
<template>
  <DemoTree
    :tree-data="treeData"
    :field-names="{ key: 'id', title: 'name', disabled: 'disabled' }"
    :features="features"
    :checked-keys="api.checkedKeys"
    :on-checked-keys-change="api.setCheckedKeys"
    checkable
  />
</template>
