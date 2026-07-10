import type { SliderController, SliderSnapshot } from '@fex/components-core/slider/types'
import { inject, type ComputedRef, type InjectionKey, type Ref } from 'vue'

export interface SliderContext {
  controller: SliderController
  rootElement: Ref<HTMLDivElement | undefined>
  snapshot: ComputedRef<SliderSnapshot>
}

export const sliderContextKey: InjectionKey<SliderContext> = Symbol('slider-context')

export function useSliderContext(componentName: string) {
  const context = inject(sliderContextKey)
  if (!context) throw new Error(`${componentName} must be used inside SliderRoot.`)
  return context
}
