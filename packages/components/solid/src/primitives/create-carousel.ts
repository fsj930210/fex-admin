import { createCarouselController } from '@fex/components-core/carousel/create-carousel-controller'
import type { CreateCarouselControllerOptions } from '@fex/components-core/carousel/types'
import { onCleanup, onMount } from 'solid-js'
import { createCoreStoreSignal } from './create-core-store-signal'

export function createCarousel(options: CreateCarouselControllerOptions = {}) {
  const controller = createCarouselController(options)
  const snapshot = createCoreStoreSignal(controller)
  let viewport: HTMLElement | undefined

  // Solid assigns refs while creating DOM nodes. Embla reads window.matchMedia during
  // initialization, so mounting must wait until the viewport is connected to the document.
  onMount(() => {
    if (viewport) controller.mount(viewport)
  })
  onCleanup(() => controller.destroy())
  return {
    controller,
    snapshot,
    mount: (node: HTMLElement | null) => { viewport = node ?? undefined },
  }
}
