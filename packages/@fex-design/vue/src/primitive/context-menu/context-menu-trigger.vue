<script setup lang="ts" generic="TPayload = unknown">
import { computed, onBeforeUnmount, type ComponentPublicInstance, type VNodeRef } from 'vue'
import { useContextMenuContext } from './context'

const props = defineProps<{ payload?: TPayload }>()
const { controller, snapshot } = useContextMenuContext<TPayload>('ContextMenuTrigger')
function setReference(element: Element | ComponentPublicInstance | null) {
  const target = element instanceof HTMLElement ? element : null
  controller.overlay.setReferenceElement(target)
}
function openAt(event: MouseEvent, x = event.clientX, y = event.clientY) {
  if (event.defaultPrevented || !(event.currentTarget instanceof HTMLElement)) return
  controller.openAt({ payload: props.payload, element: event.currentTarget, clientX: x, clientY: y, event }, {
    target: event.target, currentTarget: event.currentTarget, clientX: x, clientY: y, button: event.button,
    event, preventDefault: () => event.preventDefault(), stopPropagation: () => event.stopPropagation(),
  })
}
const triggerProps = computed(() => ({
  'aria-haspopup': 'menu' as const,
  'data-state': snapshot.value.overlay.open ? ('open' as const) : ('closed' as const),
  onContextmenu: (event: MouseEvent) => openAt(event),
  onKeydown: (event: KeyboardEvent) => {
    if ((event.shiftKey && event.key === 'F10') || event.key === 'ContextMenu') {
      event.preventDefault()
      const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
      openAt(event as unknown as MouseEvent, rect.left, rect.bottom)
    }
  },
}))
const triggerRef: VNodeRef = (element) => setReference(element)
onBeforeUnmount(() => controller.overlay.setReferenceElement(null))
</script>
<template><slot :props="triggerProps" :ref="triggerRef" :state="snapshot" /></template>
