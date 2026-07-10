import { createContext, useContext, type Accessor } from 'solid-js'
import type { createSliderController } from '@fex/components-core/slider/create-slider-controller'
type SliderController = ReturnType<typeof createSliderController>
export interface SliderContextValue { controller: SliderController, snapshot: Accessor<ReturnType<SliderController['getSnapshot']>>, rootElement: Accessor<HTMLDivElement | undefined> }
export const SliderContext = createContext<SliderContextValue>()
export function useSliderContext(componentName: string) { const context = useContext(SliderContext); if (!context) throw new Error(`${componentName} must be used inside SliderRoot.`); return context }
