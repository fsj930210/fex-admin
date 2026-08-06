<script setup lang="ts" generic="TData = unknown">
import { createTourController } from '@fex-design/core/tour/create-tour-controller'
import type { TourOptions } from '@fex-design/core/tour/types'
import { shallowEqualObject } from '@fex/utils'
import { onBeforeUnmount, onMounted, provide, useId, watchEffect, type PropType } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { tourKey } from './context'

interface TourRootProps<TData = unknown> extends TourOptions<TData> {
  keyboard?: boolean
  overlay?: boolean
  closeOnOverlayClick?: boolean
  defaultGap?: number
  zIndex?: number
  getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement
}

const props = defineProps({
  open: { type: Boolean as PropType<boolean | undefined>, default: undefined },
  defaultOpen: { type: Boolean, default: false },
  current: { type: Number as PropType<number | undefined>, default: undefined },
  defaultCurrent: { type: Number, default: 0 },
  targetMissing: String as PropType<TourOptions<TData>['targetMissing']>,
  targetTimeout: Number as PropType<number | undefined>,
  onOpenChange: Function as PropType<TourOptions<TData>['onOpenChange']>,
  onChange: Function as PropType<TourOptions<TData>['onChange']>,
  onClose: Function as PropType<TourOptions<TData>['onClose']>,
  onFinish: Function as PropType<TourOptions<TData>['onFinish']>,
  onTargetMissing: Function as PropType<TourOptions<TData>['onTargetMissing']>,
  keyboard: { type: Boolean, default: true },
  overlay: { type: Boolean, default: true },
  closeOnOverlayClick: { type: Boolean, default: true },
  defaultGap: { type: Number, default: 6 },
  zIndex: { type: Number, default: 1001 },
  getPopupContainer: Function as PropType<(referenceElement: HTMLElement | null) => HTMLElement>,
})
const controller = createTourController<TData>({
  ...(props.defaultOpen !== undefined ? { defaultOpen: props.defaultOpen } : {}),
  ...(props.defaultCurrent !== undefined ? { defaultCurrent: props.defaultCurrent } : {}),
  ...(props.open !== undefined ? { open: props.open } : {}),
  ...(props.current !== undefined ? { current: props.current } : {}),
})
const snapshot = useCoreStore(controller)
let latestOptions: TourOptions<TData> = {}

function updateOptions() {
  const next: TourOptions<TData> = {
    ...(props.open !== undefined ? { open: props.open } : {}),
    ...(props.current !== undefined ? { current: props.current } : {}),
    ...(props.targetMissing !== undefined ? { targetMissing: props.targetMissing } : {}),
    ...(props.targetTimeout !== undefined ? { targetTimeout: props.targetTimeout } : {}),
    ...(props.onOpenChange !== undefined ? { onOpenChange: props.onOpenChange } : {}),
    ...(props.onChange !== undefined ? { onChange: props.onChange } : {}),
    ...(props.onClose !== undefined ? { onClose: props.onClose } : {}),
    ...(props.onFinish !== undefined ? { onFinish: props.onFinish } : {}),
    ...(props.onTargetMissing !== undefined ? { onTargetMissing: props.onTargetMissing } : {}),
  }
  if (!shallowEqualObject(latestOptions, next)) {
    latestOptions = next
    controller.setOptions(next)
  }
}

watchEffect(updateOptions)
function handleKeydown(event: KeyboardEvent) {
  if (!snapshot.value.open || !props.keyboard) return
  if (event.key === 'Escape') {
    event.preventDefault()
    controller.close()
  } else if (event.key === 'ArrowRight') {
    event.preventDefault()
    void controller.next()
  } else if (event.key === 'ArrowLeft') {
    event.preventDefault()
    void controller.previous()
  }
}
function refresh() { controller.refreshTarget() }

provide(tourKey, {
  controller,
  snapshot,
  overlay: props.overlay ?? true,
  closeOnOverlayClick: props.closeOnOverlayClick ?? true,
  defaultGap: props.defaultGap ?? 6,
  zIndex: props.zIndex ?? 1001,
  getPopupContainer: props.getPopupContainer,
})
void useId()
onMounted(() => {
  document.addEventListener('keydown', handleKeydown)
  window.addEventListener('resize', refresh)
  window.addEventListener('scroll', refresh, true)
})
onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('resize', refresh)
  window.removeEventListener('scroll', refresh, true)
  controller.destroy()
})
</script>
<template><slot /></template>
