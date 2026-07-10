<script setup lang="ts">
import { sliderTrackClassName } from '@fex/components-styles/slider'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { useSliderContext } from './context'

defineOptions({ inheritAttrs: false })
const attrs = useAttrs()
const { snapshot } = useSliderContext('SliderTrack')
</script>

<template>
  <span
    v-bind="attrs"
    :data-disabled="snapshot.disabled ? 'true' : undefined"
    :data-orientation="snapshot.orientation"
    :class="cn(sliderTrackClassName, attrs.class as string | undefined)"
  ><slot /></span>
</template>
