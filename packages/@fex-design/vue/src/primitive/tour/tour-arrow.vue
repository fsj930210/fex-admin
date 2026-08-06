<script setup lang="ts">
import { tourArrowClassName } from '@fex-design/styles/tour'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance, StyleValue } from 'vue'
import { computed, onBeforeUnmount, useAttrs } from 'vue'
import { useTourContentContext } from './context'
const props = defineProps<{ class?: string; style?: StyleValue }>()
const attrs = useAttrs()
const { floating, snapshot } = useTourContentContext('TourArrow')
const arrowClass = computed(() => cn(tourArrowClassName, props.class))
function setArrow(value: Element | ComponentPublicInstance | null) { floating.setArrowElement(value instanceof HTMLDivElement ? value : null) }
const position = computed<Record<string, string | number>>(() => {
  if (snapshot.value.side === 'top') return { bottom: -6, left: 'var(--floating-arrow-x, 50%)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid var(--background)' }
  if (snapshot.value.side === 'bottom') return { top: -6, left: 'var(--floating-arrow-x, 50%)', borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderBottom: '6px solid var(--background)' }
  if (snapshot.value.side === 'left') return { right: -6, top: 'var(--floating-arrow-y, 50%)', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderLeft: '6px solid var(--background)' }
  return { left: -6, top: 'var(--floating-arrow-y, 50%)', borderTop: '6px solid transparent', borderBottom: '6px solid transparent', borderRight: '6px solid var(--background)' }
})
onBeforeUnmount(() => floating.setArrowElement(null))
</script>
<template><div v-bind="attrs" :ref="setArrow" data-slot="tour-arrow" :data-side="snapshot.side" :class="arrowClass" :style="[position, props.style]" /></template>
