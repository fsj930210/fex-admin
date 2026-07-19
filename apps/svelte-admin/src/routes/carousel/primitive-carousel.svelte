<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { CreateCarouselControllerOptions } from '@fex/components-core/carousel/types'
  import ChevronLeftIcon from '@fex/components-svelte/icon/chevron-left'
  import ChevronRightIcon from '@fex/components-svelte/icon/chevron-right'
  import { createCarousel } from '@fex/components-svelte/primitive/carousel'
  import {
    carouselIndicatorClassName,
    carouselIndicatorsClassName,
    carouselRootClassName,
    carouselTrackClassName,
    carouselViewportClassName,
  } from '@fex/components-styles/carousel'

  let {
    config = {},
    children,
  }: {
    config?: CreateCarouselControllerOptions
    children: Snippet
  } = $props()

  const { controller, snapshot, mount } = createCarousel(config)
</script>

<div class={carouselRootClassName}>
  <div use:mount role="region" aria-roledescription="carousel" class={carouselViewportClassName}>
    <div class={carouselTrackClassName()}>{@render children()}</div>
  </div>
  <div class="mt-3 flex justify-between">
    <button type="button" class="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Previous slide" disabled={!$snapshot.canScrollPrev} onclick={() => controller.scrollPrev()}><ChevronLeftIcon /></button>
    <button type="button" class="cursor-pointer p-2 disabled:cursor-not-allowed" aria-label="Next slide" disabled={!$snapshot.canScrollNext} onclick={() => controller.scrollNext()}><ChevronRightIcon /></button>
  </div>
  <div class={carouselIndicatorsClassName}>
    {#each $snapshot.scrollSnapIndexes as index (index)}
      <button type="button" aria-current={$snapshot.selectedIndex === index || undefined} aria-label={`Go to slide ${index + 1}`} class={carouselIndicatorClassName} onclick={() => controller.scrollTo(index)}></button>
    {/each}
  </div>
</div>
