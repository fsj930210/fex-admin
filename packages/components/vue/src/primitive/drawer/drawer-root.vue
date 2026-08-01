<script setup lang="ts">
import { createDrawerController } from '@fex/components-core/drawer/create-drawer-controller'
import { shallowEqualObject } from '@fex/utils'
import { computed, inject, onBeforeUnmount, provide, ref, shallowRef } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { drawerKey } from './context'
type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'
type DrawerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full' | number | string
type DrawerRootProps = {
  open?: boolean
  defaultOpen?: boolean
  placement?: DrawerPlacement
  modal?: boolean
  mask?: boolean
  dismiss?: boolean
  closeOnMaskPointer?: boolean
  forceMount?: boolean
  closeDelay?: number
  size?: DrawerSize
  defaultSize?: DrawerSize
  resizable?: boolean
  minSize?: number
  maxSize?: number
  onSizeChange?: (size: number) => void
}
const props = withDefaults(defineProps<DrawerRootProps>(), { open: undefined, placement: 'right', defaultOpen: false, modal: true, mask: true, closeOnMaskPointer: true })
const emit = defineEmits<{ openChange: [open: boolean, info: unknown] }>()
const parent = inject(drawerKey, null)
const depth = (parent?.depth ?? -1) + 1
const localOpen = ref(props.defaultOpen); const triggerElement = shallowRef<HTMLButtonElement | null>(null)
function options() { return { ...props, open: props.open, defaultOpen: localOpen.value, onOpenChange(next: boolean, info: unknown) { if (props.open === undefined) localOpen.value = next; emit('openChange', next, info) } } }
let latest = options(); const drawer = createDrawerController(latest); const snapshot = useCoreStore(drawer); const placement = shallowRef<DrawerPlacement>(props.placement); const mask = shallowRef(props.mask); const closeOnMaskPointer = shallowRef(props.closeOnMaskPointer)
function sync() { const next = options(); placement.value = props.placement ?? 'right'; mask.value = props.mask ?? true; closeOnMaskPointer.value = props.closeOnMaskPointer ?? true; if (!shallowEqualObject(latest, next)) { latest = next; drawer.setOptions(next) }; return '' }
provide(drawerKey, { drawer, snapshot, placement, mask, closeOnMaskPointer, depth, triggerElement, resizeOptions: { ...(props.resizable === undefined ? {} : { resizable: props.resizable }), ...(props.minSize === undefined ? {} : { minSize: props.minSize }), ...(props.maxSize === undefined ? {} : { maxSize: props.maxSize }), ...(props.onSizeChange === undefined ? {} : { onSizeChange: props.onSizeChange }) } }); onBeforeUnmount(() => drawer.destroy())
</script>
<template>{{ sync() }}<slot /></template>
