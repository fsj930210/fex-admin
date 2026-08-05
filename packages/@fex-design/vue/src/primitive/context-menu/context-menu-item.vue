<script setup lang="ts">
import { useContextMenuContext } from './context'
const { controller } = useContextMenuContext('ContextMenuItem')
const emit = defineEmits<{ click: [MouseEvent] }>()
function click(event: MouseEvent) {
  emit('click', event)
  if (!event.defaultPrevented) controller.overlay.close({ reason: 'manual', source: 'menu-item', event })
}
</script>
<template><button type="button" role="menuitem" @click="click"><slot /></button></template>
