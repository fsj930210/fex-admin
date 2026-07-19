import { DestroyRef, inject } from '@angular/core'
import { createCarouselController } from '@fex/components-core/carousel/create-carousel-controller'
import type { CarouselControllerConfig } from '@fex/components-core/carousel/types'
import { createCoreStoreSignal } from './core-store-signal'

export function createCarousel(options: CarouselControllerConfig = {}) {
  const controller = createCarouselController(options)
  inject(DestroyRef).onDestroy(() => controller.destroy())
  return { controller, snapshot: createCoreStoreSignal(controller), mount: (node: HTMLElement) => controller.mount(node) }
}
