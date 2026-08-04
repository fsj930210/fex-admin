import { createCarouselController } from '@fex-design/core/carousel/create-carousel-controller'
import type { CreateCarouselControllerOptions } from '@fex-design/core/carousel/types'
import { onBeforeUnmount, ref, type ComponentPublicInstance, type Ref } from 'vue'
import { useCoreStore } from './use-core-store'

export function useCarousel(options: CreateCarouselControllerOptions = {}) {
  const viewport: Ref<HTMLElement | null> = ref(null)
  const controller = createCarouselController(options)
  const snapshot = useCoreStore(controller)
  function mount(node: Element | ComponentPublicInstance | null) {
    const element = node instanceof HTMLElement ? node : null
    viewport.value = element
    if (element) controller.mount(element)
  }
  onBeforeUnmount(() => controller.destroy())
  return { viewport, mount, controller, snapshot }
}
