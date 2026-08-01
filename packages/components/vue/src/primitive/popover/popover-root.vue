<script setup lang="ts">
import {
  createFloatingOverlay,
  type FloatingOverlayOptions,
} from '@fex/components-core/overlay/create-floating-overlay'
import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
import { shallowEqualObject } from '@fex/utils'
import { computed, onBeforeUnmount, provide, ref, shallowRef, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { popoverKey } from './context'

const props = withDefaults(
  defineProps<
    Omit<FloatingOverlayOptions, 'onOpenChange'> & {
      defaultOpen?: boolean
      trigger?: OverlayTrigger[]
    }
  >(),
  {
    allowedTriggers: () => ['click', 'hover', 'focus', 'context-menu'],
    arrow: false,
    closeDelay: 140,
    defaultOpen: false,
    dismiss: () => ({ escapeKey: true, outsidePointer: true }),
    open: undefined,
    sideOffset: 6,
    trigger: () => ['click'],
  },
)
const emit = defineEmits<{
  openChange: [
    open: boolean,
    info: Parameters<NonNullable<FloatingOverlayOptions['onOpenChange']>>[1],
  ]
}>()
const controlled = computed(() => props.open !== undefined)
const localOpen = ref(props.defaultOpen)
const triggerElement = shallowRef<HTMLElement | null>(null)
const arrowElement = shallowRef<HTMLElement | null>(null)
const arrow = shallowRef(Boolean(props.arrow))
function handleOpenChange(
  nextOpen: boolean,
  info: Parameters<NonNullable<FloatingOverlayOptions['onOpenChange']>>[1],
) {
  if (!controlled.value) localOpen.value = nextOpen
  emit('openChange', nextOpen, info)
}
function createOptions(): FloatingOverlayOptions {
  return {
    ...props,
    open: controlled.value ? Boolean(props.open) : localOpen.value,
    onOpenChange: handleOpenChange,
  }
}
let latestOptions = createOptions()
const overlay = createFloatingOverlay(latestOptions)
const snapshot = useCoreStore(overlay)
function syncOptions() {
  const next = createOptions()
  arrow.value = Boolean(props.arrow)
  if (!shallowEqualObject(latestOptions, next)) {
    latestOptions = next
    overlay.setOptions(next)
  }
}
provide(popoverKey, { arrow, arrowElement, overlay, triggerElement, snapshot })
watchEffect(syncOptions)
onBeforeUnmount(() => overlay.destroy())
</script>
<template><slot /></template>
