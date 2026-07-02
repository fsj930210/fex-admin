<script setup lang="ts">
import { computed, useAttrs, type ComponentPublicInstance } from 'vue'
import { usePopoverContext } from './context'
import { dismissOpenPopovers, eventInfo } from './context'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const { overlay, snapshot, triggerElement } = usePopoverContext('PopoverTrigger')

function setReference(element: Element | ComponentPublicInstance | null) {
  const reference = element instanceof HTMLElement ? element : null
  triggerElement.value = reference
  overlay.setReferenceElement(reference)
}

function syncReferenceFromEvent(event: Event) {
  const currentTarget = event.currentTarget
  if (currentTarget instanceof HTMLElement) {
    triggerElement.value = currentTarget
    overlay.setReferenceElement(currentTarget)
  }
}

const triggerProps = computed(() => ({
  ...attrs,
  type: 'button' as const,
  'aria-haspopup': 'dialog' as const,
  'aria-expanded': snapshot.value.open,
  'data-state': snapshot.value.open ? 'open' : 'closed',
  onClick(event: MouseEvent) {
    syncReferenceFromEvent(event)
    dismissOpenPopovers(event, overlay)
    overlay.trigger.click(eventInfo(event))
  },
  onPointerenter(event: PointerEvent) {
    syncReferenceFromEvent(event)
    overlay.trigger.pointerEnter(eventInfo(event))
  },
  onPointerleave(event: PointerEvent) {
    syncReferenceFromEvent(event)
    overlay.trigger.pointerLeave(eventInfo(event))
  },
  onFocus(event: FocusEvent) {
    syncReferenceFromEvent(event)
    overlay.trigger.focus(eventInfo(event))
  },
  onBlur(event: FocusEvent) {
    syncReferenceFromEvent(event)
    overlay.trigger.blur(eventInfo(event))
  },
  onContextmenu(event: MouseEvent) {
    syncReferenceFromEvent(event)
    dismissOpenPopovers(event, overlay)
    overlay.trigger.contextMenu(eventInfo(event))
  },
}))
</script>

<template>
  <slot :props="triggerProps" :ref="setReference" :state="snapshot" />
</template>
