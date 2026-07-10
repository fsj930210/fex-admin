<script setup lang="ts">
import { toastTitleClassName } from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
const props = defineProps<{ class?: string }>()
</script>
<template><div v-bind="$attrs" data-slot="toast-title" :class="cn(toastTitleClassName, props.class)"><slot /></div></template>
