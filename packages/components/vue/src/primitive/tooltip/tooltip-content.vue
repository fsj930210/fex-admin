<script setup lang="ts">
import { tooltipContentClassName } from '@fex/components-styles/tooltip'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance, StyleValue } from 'vue'
import { computed, onBeforeUnmount, useAttrs } from 'vue'
import { useTooltipContext } from './context'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string; style?: StyleValue }>()
const attrs = useAttrs()
const { contentId, overlay, snapshot } = useTooltipContext('TooltipContent')
const contentClass = computed(() => cn(tooltipContentClassName, props.class))
function setContent(element: Element | ComponentPublicInstance | null) { overlay.setFloatingElement(element instanceof HTMLDivElement ? element : null) }
onBeforeUnmount(() => overlay.setFloatingElement(null))
</script>
<template><div v-if="snapshot.mounted" v-bind="attrs" :id="contentId" :ref="setContent" role="tooltip"
  data-slot="tooltip-content" :data-state="snapshot.open ? 'open' : 'closed'" :data-phase="snapshot.phase"
  :data-side="snapshot.side" :data-align="snapshot.align" :data-placement="snapshot.placement" :class="contentClass"
  :style="[{ position: 'var(--floating-strategy, absolute)', left: 'var(--floating-x, 0px)', top: 'var(--floating-y, 0px)', transformOrigin: 'var(--floating-transform-origin)' }, props.style]"><slot /></div></template>
