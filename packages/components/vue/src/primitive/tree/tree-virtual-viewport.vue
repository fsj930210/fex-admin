<script setup lang="ts" generic="TNode extends TreeNodeData">
import type { FocusFeatureApi } from '@fex/components-core/tree/features/focus'
import type { TreeKey, TreeNodeData } from '@fex/components-core/tree/types'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { cn } from '@fex/utils'
import { computed, shallowRef, useAttrs } from 'vue'
import { useTreeContext } from './context'
import { useTreeVisibleItems } from './use-tree-visible-items'

export interface TreeVirtualViewportHandle {
  scrollToKey(key: TreeKey, options?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean }): boolean
}

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ height: number; overscan?: number }>(), { overscan: 6 })
const attrs = useAttrs()
const viewportAttrs = computed(() => {
  const { class: _class, style: _style, ...rest } = attrs
  return rest
})
const viewportClass = computed(() => cn('overflow-auto', attrs.class as string | undefined))
const { tree, rowHeight } = useTreeContext<TNode>('TreeVirtualViewport')
const items = useTreeVisibleItems(tree)
const scrollElement = shallowRef<HTMLDivElement | null>(null)
const virtualizer = useVirtualizer(computed(() => ({
  count: items.value.length,
  getScrollElement: () => scrollElement.value,
  estimateSize: () => rowHeight.value,
  overscan: props.overscan,
  getItemKey: (index: number) => items.value[index]?.key ?? index,
})))

function scrollToKey(key: TreeKey, options?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean }) {
  if (options?.reveal) tree.getFeature<FocusFeatureApi>('focus')?.reveal(key)
  const index = tree.getVisibleIndex(key)
  if (index === undefined || index < 0) return false
  virtualizer.value.scrollToIndex(index, { align: options?.align ?? 'auto' })
  return true
}
defineExpose<TreeVirtualViewportHandle>({ scrollToKey })
</script>

<template>
  <div v-bind="viewportAttrs" ref="scrollElement" data-slot="tree-virtual-viewport" :class="viewportClass" :style="[attrs.style, { height: `${props.height}px` }]">
    <div class="relative w-full" :style="{ height: `${virtualizer.getTotalSize()}px` }">
      <div
        v-for="virtualItem in virtualizer.getVirtualItems()"
        :key="virtualItem.key"
        class="absolute left-0 w-full"
        :style="{ height: `${virtualItem.size}px`, transform: `translateY(${virtualItem.start}px)` }"
      >
        <slot v-if="items[virtualItem.index]" :item="items[virtualItem.index]" :tree="tree" />
      </div>
    </div>
  </div>
</template>
