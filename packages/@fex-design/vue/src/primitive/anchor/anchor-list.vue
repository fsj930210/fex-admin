<script setup lang="ts">
import type { AnchorItem, AnchorOrientation } from '@fex-design/core/anchor/types'
import { anchorLinkClassName, anchorListClassName } from '@fex-design/styles/anchor'

defineOptions({ name: 'FexAnchorList' })
defineProps<{
  items: readonly AnchorItem<string>[]
  activeKeys: readonly string[]
  highlightedKeys: ReadonlySet<string>
  orientation: AnchorOrientation
  level?: number
}>()
const emit = defineEmits<{ activate: [item: AnchorItem<string>] }>()
</script>

<template>
  <ul
    data-slot="anchor-list"
    :data-level="level ?? 0"
    :class="anchorListClassName({ orientation, nested: (level ?? 0) > 0 })"
  >
    <li
      v-for="item in items"
      :key="item.key"
      data-slot="anchor-item"
      :data-active="activeKeys.includes(item.key) || undefined"
    >
      <button
        type="button"
        data-slot="anchor-link"
        :data-anchor-key="item.key"
        :data-state="activeKeys.includes(item.key) ? 'active' : 'inactive'"
        :class="anchorLinkClassName({ orientation, active: highlightedKeys.has(item.key) })"
        @click="emit('activate', item)"
      >
        <slot name="item" :item="item" :active="activeKeys.includes(item.key)">{{ item.title }}</slot>
      </button>
      <AnchorList
        v-if="orientation === 'vertical' && item.children?.length"
        :items="item.children"
        :active-keys="activeKeys"
        :highlighted-keys="highlightedKeys"
        :orientation="orientation"
        :level="(level ?? 0) + 1"
        @activate="emit('activate', $event)"
      ><template #item="slotProps"><slot name="item" v-bind="slotProps">{{ slotProps.item.title }}</slot></template></AnchorList>
    </li>
  </ul>
</template>
