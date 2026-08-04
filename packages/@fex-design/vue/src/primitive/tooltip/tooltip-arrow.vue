<script setup lang="ts">
import { tooltipArrowClassName } from '@fex-design/styles/tooltip'
import { getTooltipArrowPosition } from '@fex-design/core/tooltip/create-tooltip'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance, StyleValue } from 'vue'
import { computed, onBeforeUnmount } from 'vue'
import { useTooltipContext } from './context'
const props = defineProps<{ class?: string; style?: StyleValue }>()
const { overlay, snapshot } = useTooltipContext('TooltipArrow')
const arrowClass = computed(() => cn(tooltipArrowClassName, props.class))
const position = computed(() => getTooltipArrowPosition(snapshot.value.side, snapshot.value.align))
function setArrow(element: Element | ComponentPublicInstance | null) { overlay.setArrowElement(element instanceof HTMLDivElement ? element : null) }
onBeforeUnmount(() => overlay.setArrowElement(null))
</script>
<template><div :ref="setArrow" data-slot="tooltip-arrow" :data-side="snapshot.side" :data-align="snapshot.align" :class="arrowClass" :style="[position, props.style]" /></template>
