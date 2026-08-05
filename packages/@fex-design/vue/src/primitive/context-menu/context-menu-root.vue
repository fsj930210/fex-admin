<script setup lang="ts" generic="TPayload = unknown">
import { createContextMenuController } from '@fex-design/core/overlay/context-menu/create-context-menu-controller'
import type { ContextMenuOptions } from '@fex-design/core/overlay/context-menu/types'
import { onBeforeUnmount, provide, ref, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { contextMenuKey, type ContextMenuContext } from './context'

type ContextMenuPlacement =
  | 'top'
  | 'right'
  | 'bottom'
  | 'left'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'
type ContextMenuRootProps<T> = {
  open?: boolean
  defaultOpen?: boolean
  placement?: ContextMenuPlacement
  side?: 'top' | 'right' | 'bottom' | 'left'
  align?: 'start' | 'center' | 'end'
  alignOffset?: number
  sideOffset?: number
  offset?: number
  strategy?: 'absolute' | 'fixed'
  avoidCollisions?: boolean
  autoAdjustOverflow?: boolean
  collisionBoundary?: unknown
  collisionPadding?: number | { top?: number; right?: number; bottom?: number; left?: number }
  arrow?: boolean
  arrowPadding?: number
  matchReferenceWidth?: boolean | 'min'
  hideWhenDetached?: boolean
  zIndex?: number
  forceMount?: boolean
  closeDelay?: number
  modal?: boolean
  dismiss?: { escapeKey?: boolean; outsidePointer?: boolean; overlayPointer?: boolean }
  disabled?: boolean
  getPopupContainer?: (referenceElement: HTMLElement | null) => HTMLElement
  hoverOpenDelay?: number
  hoverCloseDelay?: number
}
type ContextMenuChangeInfo<T> = Parameters<
  NonNullable<ContextMenuOptions<T>['onOpenChange']>
>[1]
const props = withDefaults(defineProps<ContextMenuRootProps<TPayload>>(), {
  open: undefined,
  defaultOpen: false,
  side: 'right',
  align: 'start',
  sideOffset: 2,
})
const emit = defineEmits<{ openChange: [boolean, unknown] }>()
const localOpen = ref(props.defaultOpen)
const controller = createContextMenuController<TPayload>(
  {
    ...props,
    open: props.open ?? localOpen.value,
    onOpenChange(open: boolean, info: ContextMenuChangeInfo<TPayload>) {
      if (props.open === undefined) localOpen.value = open
      emit('openChange', open, info)
    },
  } as unknown as ContextMenuOptions<TPayload>,
)
const snapshot = useCoreStore(controller)
watchEffect(() =>
  controller.setOptions({
    ...props,
    open: props.open ?? localOpen.value,
    onOpenChange(open: boolean, info: ContextMenuChangeInfo<TPayload>) {
      if (props.open === undefined) localOpen.value = open
      emit('openChange', open, info)
    },
  } as unknown as ContextMenuOptions<TPayload>),
)
provide(contextMenuKey, { controller, snapshot } as unknown as ContextMenuContext)
onBeforeUnmount(() => controller.destroy())
</script>
<template><slot /></template>
