<script setup lang="ts">
import { convertValueToPercentage } from '@fex/components-core/slider/utils'
import { sliderRangeClassName } from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useSliderContext } from './context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { snapshot } = useSliderContext('SliderRange')
const rangeStyle = computed(() => {
  const percentages = snapshot.value.values.map((value) => convertValueToPercentage(value, snapshot.value.min, snapshot.value.max))
  const start = snapshot.value.values.length > 1 ? Math.min(...percentages) : 0
  const end = 100 - Math.max(...percentages)
  return snapshot.value.orientation === 'vertical'
    ? { bottom: `${start}%`, top: `${end}%` }
    : { left: `${start}%`, right: `${end}%` }
})
</script>

<template>
  <span
    v-bind="attrs"
    :data-disabled="snapshot.disabled ? 'true' : undefined"
    :data-orientation="snapshot.orientation"
    :class="cn(sliderRangeClassName, attrs.class as string | undefined)"
    :style="[rangeStyle, attrs.style]"
  />
</template>
