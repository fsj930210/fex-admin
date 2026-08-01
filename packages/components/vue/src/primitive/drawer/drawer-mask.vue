<script setup lang="ts">
import { drawerMaskClassName } from '@fex/components-styles/drawer'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance } from 'vue'
import { onBeforeUnmount } from 'vue'
import { useDrawerContext } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const { drawer, snapshot, mask, closeOnMaskPointer } = useDrawerContext('DrawerMask')

function setMask(element: Element | ComponentPublicInstance | null) {
  drawer.setOverlayElement(element instanceof HTMLDivElement ? element : null)
}

function click(event: MouseEvent) {
  if (closeOnMaskPointer.value && event.target === event.currentTarget) {
    drawer.close({ source: 'mask', event })
  }
}

onBeforeUnmount(() => drawer.setOverlayElement(null))
</script>

<template>
  <div
    v-if="mask"
    :ref="setMask"
    v-bind="$attrs"
    data-slot="drawer-mask"
    :data-state="snapshot.open ? 'open' : 'closed'"
    :data-phase="snapshot.phase"
    :class="cn(drawerMaskClassName, props.class)"
    @click="click"
  />
</template>
