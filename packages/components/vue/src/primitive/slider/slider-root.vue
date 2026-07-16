<script setup lang="ts">
import { createSliderController } from '@fex/components-core/slider/create-slider-controller'
import type { SliderOrientation } from '@fex/components-core/slider/types'
import { getSliderValueFromPointer } from '@fex/components-core/slider/utils'
import { sliderRootClassName, type SliderStyleProps } from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import { computed, provide, ref, useAttrs } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { sliderContextKey } from './context'

defineOptions({ inheritAttrs: false })

const props = withDefaults(defineProps<{
  defaultValue?: number[]
  disabled?: boolean
  max?: number
  min?: number
  minStepsBetweenThumbs?: number
  orientation?: SliderOrientation
  size?: SliderStyleProps['size']
  step?: number
  value?: number[]
}>(), {
  disabled: false,
  max: 100,
  min: 0,
  minStepsBetweenThumbs: 0,
  orientation: 'horizontal',
  size: 'default',
  step: 1,
})

const emit = defineEmits<{
  valueChange: [value: number[]]
  valueCommit: [value: number[]]
}>()

const attrs = useAttrs()
const rootElement = ref<HTMLDivElement>()
const options = {
  get value() { return props.value },
  get defaultValue() { return props.defaultValue },
  get min() { return props.min },
  get max() { return props.max },
  get step() { return props.step },
  get minStepsBetweenThumbs() { return props.minStepsBetweenThumbs },
  get orientation() { return props.orientation },
  get disabled() { return props.disabled },
  onChange: (value: number[]) => emit('valueChange', value),
  onCommit: (value: number[]) => emit('valueCommit', value),
}
const controller = createSliderController(options)
const storeSnapshot = useCoreStore(controller)
const snapshot = computed(() => {
  void storeSnapshot.value
  return controller.getSnapshot()
})

provide(sliderContextKey, { controller, rootElement, snapshot })

function pointerValue(event: PointerEvent) {
  const element = rootElement.value
  if (!element) return undefined
  return getSliderValueFromPointer(
    event.clientX,
    event.clientY,
    element.getBoundingClientRect(),
    snapshot.value.min,
    snapshot.value.max,
    snapshot.value.orientation,
  )
}

function handlePointerDown(event: PointerEvent) {
  if (event.defaultPrevented || snapshot.value.disabled || !rootElement.value) return
  const value = pointerValue(event)
  if (value === undefined) return
  rootElement.value.setPointerCapture(event.pointerId)
  controller.startSlide(value)
}

function handlePointerMove(event: PointerEvent) {
  if (event.defaultPrevented || snapshot.value.disabled || !rootElement.value?.hasPointerCapture(event.pointerId)) return
  const value = pointerValue(event)
  if (value !== undefined) controller.moveSlide(value)
}

function handlePointerUp(event: PointerEvent) {
  if (!rootElement.value?.hasPointerCapture(event.pointerId)) return
  rootElement.value.releasePointerCapture(event.pointerId)
  controller.endSlide()
}
</script>

<template>
  <div
    v-bind="attrs"
    ref="rootElement"
    :data-disabled="snapshot.disabled ? 'true' : undefined"
    :data-orientation="snapshot.orientation"
    :class="cn(sliderRootClassName({ size: props.size, orientation: snapshot.orientation }), attrs.class as string | undefined)"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
  >
    <slot :snapshot="snapshot" :values="snapshot.values" />
  </div>
</template>
