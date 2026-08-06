<script setup lang="ts">
import type { TourStepOptions } from '@fex-design/core/tour/types'
import { onBeforeUnmount, onMounted, type PropType } from 'vue'
import { useTourContext } from './context'

const props = defineProps({
  name: { type: String, required: true },
  target: { type: String, default: null },
  placement: String as PropType<TourStepOptions['placement']>,
  arrow: [Boolean, Object] as PropType<TourStepOptions['arrow']>,
  mask: [Boolean, Object] as PropType<TourStepOptions['mask']>,
  gap: Object as PropType<TourStepOptions['gap']>,
  scrollIntoViewOptions: [Boolean, Object] as PropType<TourStepOptions['scrollIntoViewOptions']>,
  disabledInteraction: Boolean,
  data: null as unknown as PropType<unknown>,
})
const { controller, snapshot } = useTourContext('TourStep')
let unregister: (() => void) | undefined
onMounted(() => {
  unregister = controller.registerStep({ ...props } as TourStepOptions)
})
onBeforeUnmount(() => unregister?.())
</script>
<template><slot v-if="snapshot.currentStep?.name === props.name" /></template>
