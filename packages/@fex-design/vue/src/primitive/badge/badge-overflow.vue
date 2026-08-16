<script setup lang="ts">
import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { badgeOverflowClassName } from '@fex-design/styles/badge'
import { cn } from '@fex/utils'
import { computed, Fragment, useSlots, type VNode } from 'vue'
import Badge from './badge.vue'
const props = defineProps<{ maxCount?: number; class?: string }>()
const slots = useSlots()
function flatten(nodes: readonly VNode[]): VNode[] {
  return nodes.flatMap((node) => node.type === Fragment && Array.isArray(node.children) ? flatten(node.children as VNode[]) : [node])
}
const items = computed(() => flatten(slots.default?.() ?? []))
const split = computed(() => splitOverflowItems(items.value, props.maxCount))
</script>
<template>
  <div data-slot="badge-overflow" :class="cn(badgeOverflowClassName, props.class)">
    <component :is="item" v-for="(item, index) in split.visibleItems" :key="item.key ?? index" />
    <slot v-if="split.overflowCount" name="overflow" :count="split.overflowCount" :items="split.overflowItems"><Badge variant="secondary">+{{ split.overflowCount }}</Badge></slot>
  </div>
</template>
