import { createContext, use, type RefObject } from 'react'
import type { createSliderController } from '@fex/components-core/slider/create-slider-controller'
export interface SliderContextValue { controller: ReturnType<typeof createSliderController>, snapshot: ReturnType<ReturnType<typeof createSliderController>['getSnapshot']>, rootRef: RefObject<HTMLDivElement | null> }
export const SliderContext = createContext<SliderContextValue | null>(null)
export function useSliderContext(componentName: string) { const context = use(SliderContext); if (!context) throw new Error(`${componentName} must be used inside SliderRoot.`); return context }
