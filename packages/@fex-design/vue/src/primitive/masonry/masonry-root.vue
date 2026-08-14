<script setup lang="ts">
import { createMasonryController } from '@fex-design/core/masonry/create-masonry-controller'
import type { MasonryColumns, MasonryGap, MasonryLayoutDetail, MasonryPlacement } from '@fex-design/core/masonry/types'
import { masonryRootClassName } from '@fex-design/styles/masonry'
import { cn } from '@fex/utils'
import { computed, onBeforeUnmount, onMounted, provide, shallowRef, useAttrs, watch } from 'vue'
import { masonryContextKey } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ columns?: MasonryColumns; gap?: number | Partial<MasonryGap>; placement?: MasonryPlacement; direction?: 'ltr' | 'rtl'; onLayoutChange?: (detail: MasonryLayoutDetail) => void }>(), { direction: 'ltr' })
const attrs = useAttrs(), root = shallowRef<HTMLDivElement | null>(null)
const controller = createMasonryController(props)
const options = computed(() => ({ columns: props.columns, gap: props.gap, placement: props.placement, direction: props.direction, onLayoutChange: props.onLayoutChange }))
provide(masonryContextKey, { controller, options })
watch(options, value => controller.setOptions(value))
let observer: ResizeObserver | undefined
onMounted(() => { observer = new ResizeObserver(([entry]) => controller.setWidth(entry?.contentRect.width ?? 0)); if (root.value) observer.observe(root.value) })
onBeforeUnmount(() => { observer?.disconnect(); controller.destroy() })
</script>
<template><div v-bind="attrs" ref="root" :dir="props.direction" data-slot="masonry" :class="cn(masonryRootClassName, attrs.class as string | undefined)"><slot /></div></template>
