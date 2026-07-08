<script setup lang="ts">
import { dialogOverlayClassName } from '@fex/components-styles/dialog'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance } from 'vue'
import { computed, onBeforeUnmount } from 'vue'
import { useDialogContext } from './context'

defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const { dialog, snapshot } = useDialogContext('DialogOverlay')
const overlayClass = computed(() => cn(dialogOverlayClassName, props.class))

function onClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    dialog.dismiss.overlayPointer({ target: event.target, currentTarget: event.currentTarget, event })
  }
}

function setOverlay(element: Element | ComponentPublicInstance | null) {
  dialog.setOverlayElement(element instanceof HTMLDivElement ? element : null)
}

onBeforeUnmount(() => {
  dialog.setOverlayElement(null)
})
</script>

<template>
  <div
    :ref="setOverlay"
    data-slot="dialog-overlay"
    :data-state="snapshot.open ? 'open' : 'closed'"
    :data-phase="snapshot.phase"
    :class="overlayClass"
    @click="onClick"
  />
</template>
