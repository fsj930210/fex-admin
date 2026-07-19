<script setup lang="ts">
import { carouselRootClassName, carouselTrackClassName, carouselViewportClassName } from '@fex/components-styles/carousel'
import { cn } from '@fex/utils'
import { useCarousel } from '../../composables/use-carousel'

const props = defineProps({ options: Object, plugins: Array, autoplay: [Boolean, Object], class: String })
const { mount, controller, snapshot } = useCarousel(props)

defineExpose({ controller, snapshot })
</script>

<template>
  <div :class="cn(carouselRootClassName, props.class)">
    <div :ref="mount" role="region" aria-roledescription="carousel" :class="carouselViewportClassName">
      <div :class="carouselTrackClassName()"><slot /></div>
    </div>
    <slot name="controls" :controller="controller" :snapshot="snapshot" />
  </div>
</template>
