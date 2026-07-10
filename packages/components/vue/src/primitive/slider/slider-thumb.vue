<script setup lang="ts">
import { convertValueToPercentage } from '@fex/components-core/slider/utils'
import { sliderThumbClassName } from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import { computed, useAttrs, type CSSProperties } from 'vue'
import { useSliderContext } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ index?: number }>(), { index: 0 })
const attrs = useAttrs()
const context = useSliderContext('SliderThumb')
const value = computed(() => context.snapshot.value.values[props.index] ?? context.snapshot.value.min)
const percent = computed(() => convertValueToPercentage(value.value, context.snapshot.value.min, context.snapshot.value.max))
const thumbStyle = computed<CSSProperties>(() => context.snapshot.value.orientation === 'vertical'
  ? { position: 'absolute', bottom: `${percent.value}%`, left: '50%', transform: 'translate(-50%, 50%)' }
  : { position: 'absolute', top: '50%', left: `${percent.value}%`, transform: 'translate(-50%, -50%)' })

function handleKeydown(event: KeyboardEvent) {
  const snapshot = context.snapshot.value
  if (event.defaultPrevented || snapshot.disabled) return
  const keyMap: Record<string, number> = { ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1, PageUp: 10, PageDown: -10 }
  if (event.key === 'Home') {
    event.preventDefault()
    context.controller.setValueAt(props.index, snapshot.min, { commit: true })
  } else if (event.key === 'End') {
    event.preventDefault()
    context.controller.setValueAt(props.index, snapshot.max, { commit: true })
  } else if (event.key in keyMap) {
    event.preventDefault()
    const direction = keyMap[event.key]!
    context.controller.stepThumb(props.index, direction > 0 ? 1 : -1, Math.abs(direction))
  }
}
</script>

<template>
  <span
    v-bind="attrs"
    role="slider"
    :tabindex="context.snapshot.value.disabled ? undefined : 0"
    :aria-valuemin="context.snapshot.value.min"
    :aria-valuemax="context.snapshot.value.max"
    :aria-valuenow="value"
    :aria-disabled="context.snapshot.value.disabled || undefined"
    :data-disabled="context.snapshot.value.disabled ? 'true' : undefined"
    :data-orientation="context.snapshot.value.orientation"
    :class="cn(sliderThumbClassName, attrs.class as string | undefined)"
    :style="[thumbStyle, attrs.style]"
    @focus="context.controller.setActiveIndex(props.index)"
    @keydown="handleKeydown"
  />
</template>
