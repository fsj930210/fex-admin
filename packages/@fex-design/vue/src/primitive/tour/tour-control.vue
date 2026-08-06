<script setup lang="ts">
import { tourControlClassName } from '@fex-design/styles/tour'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useTourContext } from './context'
export type TourAction = 'previous' | 'next' | 'skip' | 'close' | 'complete'
const props = defineProps<{ action: TourAction; class?: string; disabled?: boolean }>()
const attrs = useAttrs()
const { controller, snapshot } = useTourContext('TourControl')
const disabled = computed(() => Boolean(props.disabled || (props.action === 'previous' && snapshot.value.isFirst)))
function handleClick(event: MouseEvent) {
  if (disabled.value) return
  if (props.action === 'previous') void controller.previous()
  else if (props.action === 'next') void controller.next()
  else if (props.action === 'skip') controller.skip()
  else if (props.action === 'close') controller.close()
  else controller.complete()
}
</script>
<template><button v-bind="attrs" type="button" :disabled="disabled" :data-tour-action="action" :class="cn(tourControlClassName, props.class)" @click="handleClick"><slot /></button></template>
