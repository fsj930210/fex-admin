<script setup lang="ts">
import { createStepsController } from '@fex-design/core/steps/create-steps-controller'
import { deserializeStepValue } from '@fex-design/core/steps/types'
import type { StepsChangeMeta, StepsOrientation, StepValue } from '@fex-design/core/steps/types'
import { stepsClassName } from '@fex-design/styles/steps'
import { cn } from '@fex/utils'
import { computed, provide, ref, useAttrs, watch } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { stepsContextKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ current?: StepValue; defaultCurrent?: StepValue; navigation?: boolean; orientation?: StepsOrientation; responsive?: boolean }>(), { navigation: false, orientation: 'horizontal', responsive: true })
const emit = defineEmits<{ change: [value: StepValue, meta: StepsChangeMeta] }>()
const controller = createStepsController({ ...props, onChange: (value, meta) => emit('change', value, meta) })
const snapshot = useCoreStore(controller)
const elements = new Map<StepValue, HTMLElement>()
const rootElement = ref<HTMLOListElement | null>(null)
function syncOrder() {
  const root = rootElement.value
  if (!root) return
  controller.setOrder([...root.querySelectorAll<HTMLElement>('[data-step-value]')].filter((element) => element.closest('[data-slot="steps"]') === root).map((element) => deserializeStepValue(element.dataset.stepValue ?? 's:')))
}
function registerElement(value: StepValue, element: HTMLElement | null) {
  if (element) elements.set(value, element)
  else elements.delete(value)
  syncOrder()
  queueMicrotask(syncOrder)
}
// Controlled props cross the Vue/core boundary, so the controller options must be refreshed here.
watch(() => [props.current, props.defaultCurrent, props.navigation] as const, () => controller.updateOptions({ ...props, onChange: (value, meta) => emit('change', value, meta) }))
provide(stepsContextKey, { controller, snapshot, orientation: () => props.orientation, navigation: () => props.navigation, registerElement })
const attrs = useAttrs()
const className = computed(() => cn(stepsClassName({ orientation: props.orientation, responsive: props.responsive }), attrs.class as string | undefined))
</script>
<template><ol ref="rootElement" v-bind="attrs" data-slot="steps" :class="className" :data-orientation="orientation"><slot /></ol></template>
