<script setup lang="ts">
import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
import { avatarClassName, avatarGroupClassName, avatarGroupOverflowClassName } from '@fex-design/styles/avatar'
import { cn } from '@fex/utils'
import { computed, Fragment, useSlots, type VNode } from 'vue'
const props = defineProps<{ maxCount?: number; class?: string }>()
const slots = useSlots()
function flatten(nodes: readonly VNode[]): VNode[] {
  return nodes.flatMap((node) => node.type === Fragment && Array.isArray(node.children) ? flatten(node.children as VNode[]) : [node])
}
const items = computed(() => flatten(slots.default?.() ?? []))
const split = computed(() => splitOverflowItems(items.value, props.maxCount))
</script>
<template>
  <div role="group" data-slot="avatar-group" :class="cn(avatarGroupClassName, props.class)">
    <component :is="item" v-for="(item, index) in split.visibleItems" :key="item.key ?? index" />
    <slot v-if="split.overflowCount" name="overflow" :count="split.overflowCount" :items="split.overflowItems">
      <span data-slot="avatar-group-overflow" :class="cn(avatarClassName({ size: 'md', shape: 'circle' }), avatarGroupOverflowClassName)">+{{ split.overflowCount }}</span>
    </slot>
  </div>
</template>
