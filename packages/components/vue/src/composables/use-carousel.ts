import { createCarouselController } from '@fex/components-core/carousel/create-carousel-controller'
import type { CreateCarouselControllerOptions } from '@fex/components-core/carousel/types'
import { onBeforeUnmount, ref, type Ref } from 'vue'
import { useCoreStore } from './use-core-store'

export function useCarousel(options: CreateCarouselControllerOptions = {}) {
  const viewport: Ref<HTMLElement | null> = ref(null)
  const controller = createCarouselController(options)
  const snapshot = useCoreStore(controller)
  function mount(node: HTMLElement | null) { viewport.value = node; if (node) controller.mount(node) }
  onBeforeUnmount(() => controller.destroy())
  return { viewport, mount, controller, snapshot }
}
