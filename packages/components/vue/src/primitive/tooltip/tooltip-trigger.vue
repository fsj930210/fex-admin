<script setup lang="ts">
import { computed, useAttrs, type ComponentPublicInstance } from 'vue'
import { tooltipEventInfo, useTooltipContext } from './context'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { contentId, overlay, snapshot, triggerElement } = useTooltipContext('TooltipTrigger')
function setReference(element: Element | ComponentPublicInstance | null) {
  const component = element as (ComponentPublicInstance & { $el?: unknown }) | null
  const reference = element instanceof HTMLElement ? element : component?.$el instanceof HTMLElement ? component.$el : null
  triggerElement.value = reference
  overlay.setReferenceElement(reference)
}
const triggerProps = computed(() => ({ ...attrs,
  'aria-describedby': snapshot.value.mounted ? [attrs['aria-describedby'], contentId].filter(Boolean).join(' ') : attrs['aria-describedby'],
  'data-state': snapshot.value.open ? 'open' : 'closed',
  onPointerenter: (event: PointerEvent) => overlay.trigger.pointerEnter(tooltipEventInfo(event)),
  onPointerleave: (event: PointerEvent) => overlay.trigger.pointerLeave(tooltipEventInfo(event)),
  onFocus: (event: FocusEvent) => overlay.trigger.focus(tooltipEventInfo(event)),
  onBlur: (event: FocusEvent) => overlay.trigger.blur(tooltipEventInfo(event)),
}))
</script>
<template><slot :props="triggerProps" :ref="setReference" :state="snapshot" /></template>
