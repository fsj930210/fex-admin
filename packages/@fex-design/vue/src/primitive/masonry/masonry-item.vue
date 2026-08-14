<script setup lang="ts">
import type { MasonryKey } from '@fex-design/core/masonry/types'
import { masonryItemClassName } from '@fex-design/styles/masonry'
import { cn } from '@fex/utils'
import { computed, onBeforeUnmount, onMounted, shallowRef, useAttrs, watch } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { useMasonryContext } from './context'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ itemKey: MasonryKey; index: number; column?: number }>(), attrs = useAttrs()
const element = shallowRef<HTMLDivElement | null>(null), { controller } = useMasonryContext('MasonryItem'), snapshot = useCoreStore(controller)
const position = computed(() => snapshot.value.items.find(item => item.key === props.itemKey))
let observer: ResizeObserver | undefined
function commit(height: number) { controller.setItem({ key: props.itemKey, index: props.index, column: props.column, height }) }
watch(() => [props.index, props.column], () => { if (element.value) commit(element.value.getBoundingClientRect().height) })
onMounted(() => { observer = new ResizeObserver(([entry]) => commit(entry?.borderBoxSize[0]?.blockSize ?? entry?.contentRect.height ?? 0)); if (element.value) { observer.observe(element.value); commit(element.value.getBoundingClientRect().height) } })
onBeforeUnmount(() => { observer?.disconnect(); controller.removeItem(props.itemKey) })
</script>
<template><div v-bind="attrs" ref="element" data-slot="masonry-item" :data-column="position?.column" :class="cn(masonryItemClassName, attrs.class as string | undefined)" :style="[attrs.style, { visibility: position ? undefined : 'hidden', '--masonry-inline-start': `${position?.inlineStart ?? 0}px`, '--masonry-top': `${position?.top ?? 0}px`, '--masonry-item-width': `${position?.width ?? snapshot.columnWidth}px` }]"><slot /></div></template>
