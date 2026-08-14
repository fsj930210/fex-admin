import type { ColorChannel,ColorPickerController,ColorPickerSnapshot } from '@fex-design/core/color-picker/types'
import type { GradientController,GradientSnapshot } from '@fex-design/core/gradient/types'
import { createContext,useContext,type Accessor } from 'solid-js'
export const ColorPickerContext=createContext<{controller:ColorPickerController;snapshot:Accessor<ColorPickerSnapshot>}>()
export const AreaContext=createContext<{x:Accessor<ColorChannel>;y:Accessor<ColorChannel>}>()
export const ChannelContext=createContext<Accessor<ColorChannel>>()
export const GradientContext=createContext<{controller:GradientController;snapshot:Accessor<GradientSnapshot>}>()
export function useColorPicker(){const c=useContext(ColorPickerContext);if(!c)throw new Error('ColorPicker parts must be used inside ColorPickerRoot.');return c}
export function useArea(){const c=useContext(AreaContext);if(!c)throw new Error('ColorPickerAreaThumb must be used inside ColorPickerArea.');return c}
export function useChannel(){const c=useContext(ChannelContext);if(!c)throw new Error('ColorPickerChannel parts must be used inside ColorPickerChannel.');return c}
export function useGradientPicker(){const c=useContext(GradientContext);if(!c)throw new Error('GradientPicker parts must be used inside GradientPickerRoot.');return c}
