import type { SliderController, SliderSnapshot } from '@fex/components-core/slider/types'
import type { Readable } from 'svelte/store'

export const sliderContextKey = Symbol('slider-context')

export interface SliderContext {
  controller: SliderController
  snapshot: Readable<SliderSnapshot>
}
