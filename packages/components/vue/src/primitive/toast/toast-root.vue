<script setup lang="ts">
import { toastRootClassName, type ToastStyleProps } from '@fex/components-styles/toast'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import { toast as defaultToast, type VueToastItem, type VueToastManager } from './toast-manager'

const props = defineProps<{ class?: string, manager?: VueToastManager, toast: VueToastItem }>()
const manager = computed(() => props.manager ?? defaultToast)
const variant = computed<NonNullable<ToastStyleProps['variant']>>(() => {
  const value = props.toast.variant
  return value === 'success' || value === 'info' || value === 'warning' || value === 'error' || value === 'loading' ? value : 'default'
})
</script>

<template>
  <div
    v-bind="$attrs"
    role="status"
    data-slot="toast"
    :data-paused="props.toast.paused ? '' : undefined"
    :data-variant="props.toast.variant"
    :class="cn(toastRootClassName({ variant }), props.class)"
    @pointerenter="manager.pause(props.toast.id)"
    @pointerleave="manager.resume(props.toast.id)"
  ><slot :toast="props.toast" :manager="manager" /></div>
</template>
