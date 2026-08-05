<script setup lang="ts">
import { Teleport } from 'vue'
import { useContextMenuContext } from './context'
const props = defineProps<{ to?: string | HTMLElement }>()
const { controller, snapshot } = useContextMenuContext('ContextMenuPortal')
</script>
<template><Teleport v-if="snapshot.overlay.mounted" :to="props.to ?? controller.overlay.resolvePopupContainer() ?? 'body'"><slot /></Teleport></template>
