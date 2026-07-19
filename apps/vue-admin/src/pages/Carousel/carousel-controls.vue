<script setup lang="ts">
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-vue/icon/chevron'
import type { CarouselController, CarouselSnapshot } from '@fex/components-core/carousel/types'
import { carouselIndicatorClassName, carouselIndicatorsClassName } from '@fex/components-styles/carousel'

defineProps<{ controller: CarouselController; snapshot: CarouselSnapshot }>()
</script>

<template>
  <div class="mt-3 flex justify-between">
    <button type="button" class="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Previous slide" :disabled="!snapshot.canScrollPrev" @click="controller.scrollPrev()"><ChevronLeftIcon /></button>
    <button type="button" class="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Next slide" :disabled="!snapshot.canScrollNext" @click="controller.scrollNext()"><ChevronRightIcon /></button>
  </div>
  <div :class="carouselIndicatorsClassName">
    <button v-for="index in snapshot.scrollSnapIndexes" :key="index" type="button" :aria-current="snapshot.selectedIndex === index || undefined" :aria-label="`Go to slide ${index + 1}`" :class="carouselIndicatorClassName" @click="controller.scrollTo(index)" />
  </div>
</template>
