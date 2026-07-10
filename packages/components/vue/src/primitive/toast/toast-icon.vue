<script setup lang="ts">
import { toastIconClassName } from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
const props = defineProps<{ class?: string }>()
</script>
<template><div v-bind="$attrs" data-slot="toast-icon" :class="cn(toastIconClassName, props.class)"><slot /></div></template>
