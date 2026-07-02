<script setup lang="ts">
import { computed } from 'vue'
import { usePopoverContext } from './context'

const props = defineProps<{
  container?: HTMLElement | null
  forceMount?: boolean
}>()

const { overlay, snapshot } = usePopoverContext('PopoverPortal')
const popupContainer = computed(() => props.container ?? overlay.resolvePopupContainer())
const shouldRender = computed(() => Boolean(popupContainer.value) && (snapshot.value.mounted || props.forceMount))
</script>

<template>
  <Teleport v-if="shouldRender" :to="popupContainer!">
    <slot />
  </Teleport>
</template>
