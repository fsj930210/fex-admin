<script setup lang="ts">
import { computed } from 'vue'
import { useTooltipContext } from './context'
const props = defineProps<{ container?: HTMLElement | null; forceMount?: boolean }>()
const { overlay, snapshot } = useTooltipContext('TooltipPortal')
const target = computed(() => props.container ?? overlay.resolvePopupContainer() ?? 'body')
</script>
<template><Teleport v-if="snapshot.mounted || forceMount" :to="target"><slot /></Teleport></template>
