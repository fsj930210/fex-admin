<script setup lang="ts">
import type {
  CarouselAutoplay,
  CarouselOptions,
  CarouselPlugin,
  CreateCarouselControllerOptions,
} from '@fex-design/core/carousel/types'
import {
  carouselRootClassName,
  carouselTrackClassName,
  carouselViewportClassName,
} from '@fex-design/styles/carousel'
import { cn } from '@fex/utils'
import { useCarousel } from '../../composables/use-carousel'

const props = defineProps<{
  options?: CarouselOptions | undefined
  plugins?: CarouselPlugin[] | undefined
  autoplay?: CarouselAutoplay | undefined
  class?: string | undefined
}>()
const options: CreateCarouselControllerOptions = {
  ...(props.options === undefined ? {} : { options: props.options }),
  ...(props.plugins === undefined ? {} : { plugins: props.plugins }),
  ...(props.autoplay === undefined ? {} : { autoplay: props.autoplay }),
}
const { mount, controller, snapshot } = useCarousel(options)

defineExpose({ controller, snapshot })
</script>

<template>
  <div :class="cn(carouselRootClassName, props.class)">
    <div
      :ref="mount"
      role="region"
      aria-roledescription="carousel"
      :class="carouselViewportClassName"
    >
      <div :class="carouselTrackClassName()"><slot /></div>
    </div>
    <slot name="controls" :controller="controller" :snapshot="snapshot" />
  </div>
</template>
