<script setup lang="ts">
import { toastCloseClassName } from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { toast as defaultToast, type VueToastItem, type VueToastManager } from './toast-manager'
const props = defineProps<{ class?: string, manager?: VueToastManager, toast: VueToastItem }>()
const manager = computed(() => props.manager ?? defaultToast)
</script>
<template><button v-bind="$attrs" type="button" aria-label="Close toast" data-slot="toast-close" :class="cn(toastCloseClassName, props.class)" @click="manager.dismiss(props.toast.id)"><slot /></button></template>
