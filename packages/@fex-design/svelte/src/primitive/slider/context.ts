import type { SliderController, SliderSnapshot } from '@fex-design/core/slider/types'

export const sliderContextKey = Symbol('slider-context')

export interface SliderContext {
  controller: SliderController
  snapshot: () => SliderSnapshot
}
