<script setup lang="ts">
import { createRateController } from '@fex-design/core/rate/create-rate-controller'
import type { RateDirection } from '@fex-design/core/rate/types'
import { getRateItemFill } from '@fex-design/core/rate/utils'
import {
  rateEmptyContentClassName,
  rateFilledContentClassName,
  rateItemClassName,
  rateRootClassName,
  type RateStyleProps,
} from '@fex-design/styles/rate'
import { cn } from '@fex/utils'
import { computed, ref, useAttrs } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import StarIcon from '../../icon/star-icon.vue'
import { getRatePointerValue } from './rate-interactions'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    value?: number
    defaultValue?: number
    count?: number
    step?: number
    disabled?: boolean
    readOnly?: boolean
    allowClear?: boolean
    direction?: RateDirection
    size?: RateStyleProps['size']
    getValueText?: (value: number, count: number) => string
  }>(),
  {
    count: 5,
    step: 1,
    disabled: false,
    readOnly: false,
    allowClear: true,
    direction: 'ltr',
    size: 'default',
  },
)
const emit = defineEmits<{
  valuePreviewChange: [value: number | null]
  valueChange: [value: number]
  valueCommit: [value: number]
}>()
const attrs = useAttrs()
const root = ref<HTMLDivElement>()
const options = {
  get value() {
    return props.value
  },
  get defaultValue() {
    return props.defaultValue
  },
  get count() {
    return props.count
  },
  get step() {
    return props.step
  },
  get disabled() {
    return props.disabled
  },
  get readOnly() {
    return props.readOnly
  },
  get allowClear() {
    return props.allowClear
  },
  get direction() {
    return props.direction
  },
  onPreviewChange: (value: number | null) => emit('valuePreviewChange', value),
  onChange: (value: number) => emit('valueChange', value),
  onCommit: (value: number) => emit('valueCommit', value),
}
const controller = createRateController(options)
const storeSnapshot = useCoreStore(controller)
const snapshot = computed(() => {
  void storeSnapshot.value
  return controller.getSnapshot()
})

function pointerValue(event: PointerEvent) {
  if (!root.value) return 0
  return getRatePointerValue(
    root.value,
    event.clientX,
    snapshot.value.step,
    snapshot.value.count,
    snapshot.value.direction,
  )
}
function handlePointerDown(event: PointerEvent) {
  if (event.defaultPrevented || snapshot.value.disabled || snapshot.value.readOnly || !root.value)
    return
  root.value.setPointerCapture(event.pointerId)
  controller.startInteraction(pointerValue(event))
}
function handlePointerMove(event: PointerEvent) {
  if (event.defaultPrevented || snapshot.value.disabled || snapshot.value.readOnly) return
  const value = pointerValue(event)
  if (snapshot.value.interacting) controller.moveInteraction(value)
  else controller.preview(value)
}
function handlePointerUp(event: PointerEvent) {
  if (root.value?.hasPointerCapture(event.pointerId))
    root.value.releasePointerCapture(event.pointerId)
  controller.commitInteraction()
}
function handlePointerOut(event: PointerEvent) {
  if (event.relatedTarget instanceof Node && root.value?.contains(event.relatedTarget)) return
  controller.clearPreview()
}
function handleKeydown(event: KeyboardEvent) {
  if (snapshot.value.disabled || snapshot.value.readOnly) return
  const horizontal = snapshot.value.direction === 'rtl' ? -1 : 1
  const directions: Record<string, number> = {
    ArrowRight: horizontal,
    ArrowLeft: -horizontal,
    ArrowUp: 1,
    ArrowDown: -1,
  }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault()
    controller.setValue(event.key === 'Home' ? 0 : snapshot.value.count, { commit: true })
  } else if (event.key === 'PageUp' || event.key === 'PageDown') {
    event.preventDefault()
    controller.stepValue(event.key === 'PageUp' ? 1 : -1, 10)
  } else if (event.key in directions) {
    event.preventDefault()
    controller.stepValue(directions[event.key]!)
  }
}
function itemState(index: number, layer: 'empty' | 'filled') {
  const fill = getRateItemFill(snapshot.value.displayValue, index)
  return {
    index,
    layer,
    fill,
    fillPercent: fill * 100,
    full: fill === 1,
    partial: fill > 0 && fill < 1,
    empty: fill === 0,
    previewing: snapshot.value.previewValue !== null,
    disabled: snapshot.value.disabled,
    readOnly: snapshot.value.readOnly,
  }
}
function clipPath(index: number) {
  const hidden = (1 - getRateItemFill(snapshot.value.displayValue, index)) * 100
  return snapshot.value.direction === 'rtl' ? `inset(0 0 0 ${hidden}%)` : `inset(0 ${hidden}% 0 0)`
}
</script>

<template>
  <div
    v-bind="attrs"
    ref="root"
    role="slider"
    :tabindex="snapshot.disabled ? undefined : 0"
    :dir="snapshot.direction"
    :aria-valuemin="0"
    :aria-valuemax="snapshot.count"
    :aria-valuenow="snapshot.value"
    :aria-valuetext="
      getValueText?.(snapshot.value, snapshot.count) ?? `${snapshot.value} out of ${snapshot.count}`
    "
    :aria-disabled="snapshot.disabled || undefined"
    :aria-readonly="snapshot.readOnly || undefined"
    :data-disabled="snapshot.disabled ? 'true' : undefined"
    :data-readonly="String(snapshot.readOnly)"
    :class="cn(rateRootClassName({ size: props.size }), attrs.class as string | undefined)"
    @pointerdown="handlePointerDown"
    @pointermove="handlePointerMove"
    @pointerup="handlePointerUp"
    @pointercancel="controller.cancelInteraction"
    @pointerleave="controller.clearPreview"
    @pointerout="handlePointerOut"
    @keydown="handleKeydown"
  >
    <span
      v-for="index in snapshot.count"
      :key="index"
      :data-rate-item="index - 1"
      :class="rateItemClassName"
    >
      <span :class="rateEmptyContentClassName"
        ><slot v-bind="itemState(index - 1, 'empty')"><StarIcon aria-hidden="true" /></slot
      ></span>
      <span :class="rateFilledContentClassName" :style="{ clipPath: clipPath(index - 1) }"
        ><slot v-bind="itemState(index - 1, 'filled')"><StarIcon aria-hidden="true" /></slot
      ></span>
    </span>
  </div>
</template>
