<script setup lang="ts">
import { computed, useAttrs } from 'vue'
import { useDialogContext } from './context'

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()
const { dialog } = useDialogContext('DialogClose')

const closeProps = computed(() => ({
  ...attrs,
  type: 'button' as const,
  'data-slot': 'dialog-close',
  onClick(event: MouseEvent) {
    dialog.close({ reason: 'manual', source: 'close-button', event })
  },
}))
</script>

<template>
  <slot :props="closeProps" />
</template>
