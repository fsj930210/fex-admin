<script setup lang="ts" generic="T">
import type { MasonryKey } from '@fex-design/core/masonry/types'
import { resolveMasonryColumns, resolveMasonryGap } from '@fex-design/core/masonry/layout'
import { masonryVirtualViewportClassName } from '@fex-design/styles/masonry'
import { useVirtualizer } from '@tanstack/vue-virtual'
import { cn } from '@fex/utils'
import { computed, shallowRef, useAttrs } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { useMasonryContext } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ items: readonly T[]; getItemKey: (item: T, index: number) => MasonryKey; estimateSize: (item: T, index: number) => number; height: number; overscan?: number }>(), { overscan: 4 })
const attrs = useAttrs(), scroll = shallowRef<HTMLDivElement | null>(null), { controller, options } = useMasonryContext('MasonryVirtualViewport'), snapshot = useCoreStore(controller)
const gap = computed(() => resolveMasonryGap(options.value.gap)), columns = computed(() => resolveMasonryColumns(options.value.columns, snapshot.value.width, gap.value.column))
const columnWidth = computed(() => Math.max(0, (snapshot.value.width - gap.value.column * (columns.value - 1)) / columns.value))
const directionSign = computed(() => options.value.direction === 'rtl' ? -1 : 1)
const virtualizer = useVirtualizer(computed(() => ({ count: props.items.length, getScrollElement: () => scroll.value, getItemKey: (index: number) => props.getItemKey(props.items[index] as T, index), estimateSize: (index: number) => props.estimateSize(props.items[index] as T, index), overscan: props.overscan, gap: gap.value.row, lanes: columns.value, laneAssignmentMode: 'measured' as const })))
</script>
<template><div v-bind="attrs" ref="scroll" data-slot="masonry-virtual-viewport" :class="cn(masonryVirtualViewportClassName, attrs.class as string | undefined)" :style="[attrs.style, { height: `${height}px` }]"><div class="relative w-full" :style="{ height: `${virtualizer.getTotalSize()}px` }"><div v-for="virtualItem in virtualizer.getVirtualItems()" :key="String(virtualItem.key)" :ref="virtualizer.measureElement" :data-index="virtualItem.index" :data-column="virtualItem.lane" class="absolute start-0 top-0 min-w-0" :style="{ width: `${columnWidth}px`, transform: `translate3d(${directionSign * (virtualItem.lane ?? 0) * (columnWidth + gap.column)}px, ${virtualItem.start}px, 0)` }"><slot :item="items[virtualItem.index]" :index="virtualItem.index" /></div></div></div></template>
