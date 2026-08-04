import { createCarouselController } from '@fex-design/core/carousel/create-carousel-controller'
import type { CreateCarouselControllerOptions } from '@fex-design/core/carousel/types'
import { readableCoreStore } from './core-store'

export function createCarousel(options: CreateCarouselControllerOptions = {}) {
  const controller = createCarouselController(options)
  return {
    controller,
    snapshot: readableCoreStore(controller),
    mount: (node: HTMLElement) => {
      controller.mount(node)
      return { destroy: () => controller.destroy() }
    },
  }
}
