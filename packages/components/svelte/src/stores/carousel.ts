import { createCarouselController } from '@fex/components-core/carousel/create-carousel-controller'
import type { CreateCarouselControllerOptions } from '@fex/components-core/carousel/types'
import { readableCoreStore } from './core-store'

export function createCarousel(options: CreateCarouselControllerOptions = {}) {
  const controller = createCarouselController(options)
  return { controller, snapshot: readableCoreStore(controller), mount: (node: HTMLElement) => { controller.mount(node); return { destroy: () => controller.destroy() } } }
}
