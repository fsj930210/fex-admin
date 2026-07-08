<script setup lang="ts">
import { computed } from 'vue'
import { useDialogContext } from './context'

const props = defineProps<{ container?: HTMLElement | null; forceMount?: boolean }>()
const { snapshot } = useDialogContext('DialogPortal')
const target = computed(() => props.container ?? globalThis.document?.body)
</script>

<template>
  <Teleport v-if="target && (snapshot.mounted || forceMount)" :to="target">
    <slot />
  </Teleport>
</template>
