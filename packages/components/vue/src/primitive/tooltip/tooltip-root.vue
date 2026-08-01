<script setup lang="ts">
import { createTooltip, type TooltipOptions } from '@fex/components-core/tooltip/create-tooltip'
import type { FloatingOverlayOptions } from '@fex/components-core/overlay/create-floating-overlay'
import { shallowEqualObject } from '@fex/utils'
import { computed, onBeforeUnmount, provide, ref, shallowRef, useId, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { tooltipKey } from './context'

interface TooltipRootProps {
  align?: FloatingOverlayOptions['align']
  alignOffset?: number
  avoidCollisions?: boolean
  closeDelay?: number
  collisionPadding?: FloatingOverlayOptions['collisionPadding']
  defaultOpen?: boolean
  disabled?: boolean
  forceMount?: boolean
  getPopupContainer?: FloatingOverlayOptions['getPopupContainer']
  hoverCloseDelay?: number
  hoverOpenDelay?: number
  open?: boolean
  placement?: FloatingOverlayOptions['placement']
  side?: FloatingOverlayOptions['side']
  sideOffset?: number
}
const props = withDefaults(defineProps<TooltipRootProps>(), { defaultOpen: false, open: undefined })
const emit = defineEmits<{ openChange: [open: boolean, info: Parameters<NonNullable<TooltipOptions['onOpenChange']>>[1]] }>()
const controlled = computed(() => props.open !== undefined)
const localOpen = ref(props.defaultOpen)
const triggerElement = shallowRef<HTMLElement | null>(null)
function handleOpenChange(open: boolean, info: Parameters<NonNullable<TooltipOptions['onOpenChange']>>[1]) {
  if (!controlled.value) localOpen.value = open
  emit('openChange', open, info)
}
function createOptions(): TooltipOptions { return { ...props, open: controlled.value ? Boolean(props.open) : localOpen.value, onOpenChange: handleOpenChange } }
let latestOptions = createOptions()
const overlay = createTooltip(latestOptions)
const snapshot = useCoreStore(overlay)
provide(tooltipKey, { contentId: `fex-tooltip-${useId().replaceAll(':', '')}`, overlay, snapshot, triggerElement })
watchEffect(() => { const next = createOptions(); if (!shallowEqualObject(latestOptions, next)) { latestOptions = next; overlay.setOptions(next) } })
onBeforeUnmount(() => overlay.destroy())
</script>
<template><slot /></template>
