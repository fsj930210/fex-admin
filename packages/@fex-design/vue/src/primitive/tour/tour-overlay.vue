<script setup lang="ts">
import { tourOverlayClassName } from '@fex-design/styles/tour'
import { cn } from '@fex/utils'
import { computed, useId, useAttrs } from 'vue'
import { useTourContext } from './context'
const props = defineProps<{ class?: string; style?: Record<string, string | number> }>()
const attrs = useAttrs()
const { snapshot, overlay, closeOnOverlayClick, controller, defaultGap, zIndex } = useTourContext('TourOverlay')
const step = computed(() => snapshot.value.currentStep)
const mask = computed(() => step.value?.mask !== false && overlay !== false)
const color = computed(() => typeof step.value?.mask === 'object' && step.value.mask.color ? step.value.mask.color : 'rgba(15, 23, 42, 0.58)')
const gap = computed(() => step.value?.gap?.offset ?? defaultGap)
const rect = computed(() => {
  const target = snapshot.value.targetRect
  if (!target) return null
  const x = Array.isArray(gap.value) ? gap.value[0] : gap.value
  const y = Array.isArray(gap.value) ? gap.value[1] : gap.value
  return { x: target.x - x, y: target.y - y, width: target.width + x * 2, height: target.height + y * 2 }
})
const maskId = `tour-mask-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
function viewportWidth() { return typeof window === 'undefined' ? 1 : window.innerWidth }
function viewportHeight() { return typeof window === 'undefined' ? 1 : window.innerHeight }
function handleClick(event: MouseEvent) {
  if (closeOnOverlayClick && event.target === event.currentTarget) controller.close()
}
const overlayClass = computed(() => cn(tourOverlayClassName, props.class))
</script>
<template>
  <div
    v-if="snapshot.open"
    v-bind="attrs"
    :class="overlayClass"
    :style="{ pointerEvents: step?.disabledInteraction ? 'auto' : 'none', zIndex: zIndex - 1, ...props.style }"
    data-slot="tour-overlay"
    @click="handleClick"
  >
    <slot :props="{ class: overlayClass, style: { pointerEvents: step?.disabledInteraction ? 'auto' : 'none', zIndex: zIndex - 1 }, onClick: handleClick, 'data-slot': 'tour-overlay' }" :target-rect="snapshot.targetRect" :gap="gap" :color="color">
      <svg aria-hidden="true" class="size-full" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs><mask :id="maskId"><rect width="100" height="100" fill="white" /><rect v-if="rect" :x="`${(rect.x / viewportWidth()) * 100}%`" :y="`${(rect.y / viewportHeight()) * 100}%`" :width="`${(rect.width / viewportWidth()) * 100}%`" :height="`${(rect.height / viewportHeight()) * 100}%`" fill="black" /></mask></defs>
        <rect width="100" height="100" :fill="color" :mask="`url(#${maskId})`" />
      </svg>
    </slot>
  </div>
</template>
