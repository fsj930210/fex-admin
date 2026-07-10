<script setup lang="ts">
import { toastActionClassName } from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
const props = defineProps<{ class?: string }>()
</script>
<template><div v-bind="$attrs" data-slot="toast-action" :class="cn(toastActionClassName, props.class)"><slot /></div></template>
