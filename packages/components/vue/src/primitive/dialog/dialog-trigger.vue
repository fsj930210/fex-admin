<script setup lang="ts">
import { computed, useAttrs, type ComponentPublicInstance } from 'vue'
import { useDialogContext } from './context'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const { contentId, dialog, snapshot, triggerElement } = useDialogContext('DialogTrigger')

function setTrigger(element: Element | ComponentPublicInstance | null) {
  triggerElement.value = element instanceof HTMLButtonElement ? element : null
}

const triggerProps = computed(() => ({
  ...attrs,
  type: 'button' as const,
  'aria-haspopup': 'dialog' as const,
  'aria-expanded': snapshot.value.open,
  'aria-controls': snapshot.value.open ? contentId : undefined,
  'data-state': snapshot.value.open ? 'open' : 'closed',
  onClick(event: MouseEvent) {
    dialog.toggle({ reason: 'trigger-click', event })
  },
}))
</script>

<template>
  <slot :props="triggerProps" :ref="setTrigger" :state="snapshot" />
</template>
