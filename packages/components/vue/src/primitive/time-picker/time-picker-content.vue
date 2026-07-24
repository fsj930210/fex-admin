<script setup lang="ts">
import { useAttrs } from 'vue'
import PopoverContent from '../popover/popover-content.vue'
import PopoverPortal from '../popover/popover-portal.vue'
defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
</script>
<template><PopoverPortal><PopoverContent v-bind="attrs" class="overflow-hidden p-0" :style="{ width: 'var(--floating-reference-width)', maxWidth: 'var(--floating-available-width)', maxHeight: 'var(--floating-available-height)' }"><slot /></PopoverContent></PopoverPortal></template>
