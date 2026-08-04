<script setup lang="ts">
import { popoverContentClassName } from '@fex-design/styles/popover'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance, StyleValue } from 'vue'
import { computed, onBeforeUnmount, shallowRef, useAttrs } from 'vue'
import { eventInfo } from './context'
import { usePopoverContext } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string; style?: StyleValue }>()
const attrs = useAttrs()
const { hoverAncestors, overlay, snapshot } = usePopoverContext('PopoverContent')
const contentElement = shallowRef<HTMLDivElement | null>(null)

const contentClass = computed(() => cn(popoverContentClassName(), props.class))
const contentStyle = computed<Record<string, string>>(() => ({
  position: 'var(--floating-strategy, absolute)',
  left: 'var(--floating-x, 0px)',
  top: 'var(--floating-y, 0px)',
  transformOrigin: 'var(--floating-transform-origin)',
}))

function setContentElement(element: Element | ComponentPublicInstance | null) {
  contentElement.value = element instanceof HTMLDivElement ? element : null
  overlay.setFloatingElement(contentElement.value)
}

function handlePointerEnter(event: PointerEvent) {
  hoverAncestors.forEach((ancestor) => ancestor.content.pointerEnter(eventInfo(event)))
  overlay.content.pointerEnter(eventInfo(event))
}

function handlePointerLeave(event: PointerEvent) {
  hoverAncestors.forEach((ancestor) => ancestor.content.pointerLeave(eventInfo(event)))
  overlay.content.pointerLeave(eventInfo(event))
}

onBeforeUnmount(() => {
  overlay.setFloatingElement(null)
})
</script>

<template>
  <div
    v-if="snapshot.mounted"
    v-bind="attrs"
    :ref="setContentElement"
    :role="(attrs.role as string | undefined) ?? 'dialog'"
    tabindex="-1"
    data-slot="popover-content"
    :data-state="snapshot.open ? 'open' : 'closed'"
    :data-phase="snapshot.phase"
    :data-side="snapshot.side"
    :data-align="snapshot.align"
    :data-placement="snapshot.placement"
    :class="contentClass"
    :style="[contentStyle, props.style]"
    @pointerenter="handlePointerEnter"
    @pointerleave="handlePointerLeave"
  >
    <slot />
  </div>
</template>
