<script setup lang="ts">
import { dialogContentClassName, type DialogStyleProps } from '@fex/components-styles/dialog'
import { cn } from '@fex/utils'
import type { ComponentPublicInstance } from 'vue'
import { computed, onBeforeUnmount } from 'vue'
import { useDialogContext } from './context'

defineOptions({ inheritAttrs: false })

const props = defineProps<{ class?: string; size?: DialogStyleProps['size'] }>()
const { contentId, descriptionId, dialog, snapshot, titleId } = useDialogContext('DialogContent')
const contentClass = computed(() => cn(dialogContentClassName({ size: props.size }), props.class))

function setContent(element: Element | ComponentPublicInstance | null) {
  dialog.setLayerElement(element instanceof HTMLDivElement ? element : null)
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    dialog.dismiss.escapeKey({ target: event.target, currentTarget: event.currentTarget, event })
  }
}

onBeforeUnmount(() => {
  dialog.setLayerElement(null)
})
</script>

<template>
  <div
    v-if="snapshot.mounted"
    :ref="setContent"
    :id="contentId"
    role="dialog"
    aria-modal="true"
    :aria-labelledby="titleId"
    :aria-describedby="descriptionId"
    tabindex="-1"
    data-slot="dialog-content"
    :data-state="snapshot.open ? 'open' : 'closed'"
    :data-phase="snapshot.phase"
    :class="contentClass"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
