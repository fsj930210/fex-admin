import type { StepsController, StepsOrientation, StepsSnapshot } from '@fex/components-core/steps/types'
import type { InjectionKey, ShallowRef } from 'vue'

export interface StepsContextValue {
  controller: StepsController
  snapshot: ShallowRef<StepsSnapshot>
  orientation: () => StepsOrientation
  navigation: () => boolean
  registerElement: (value: import('@fex/components-core/steps/types').StepValue, element: HTMLElement | null) => void
}
export const stepsContextKey: InjectionKey<StepsContextValue> = Symbol('StepsContext')
export const stepContextKey = Symbol('StepContext')
