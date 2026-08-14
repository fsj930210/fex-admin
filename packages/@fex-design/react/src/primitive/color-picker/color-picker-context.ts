import { createContext, use } from 'react'
import type { ColorChannel, ColorPickerController, ColorPickerSnapshot } from '@fex-design/core/color-picker/types'
import type { GradientController, GradientSnapshot } from '@fex-design/core/gradient/types'
export const ColorPickerContext=createContext<{controller:ColorPickerController;snapshot:ColorPickerSnapshot}|null>(null)
export const GradientPickerContext=createContext<{controller:GradientController;snapshot:GradientSnapshot}|null>(null)
export const ColorPickerAreaContext=createContext<{xChannel:ColorChannel;yChannel:ColorChannel}|null>(null)
export const ColorPickerChannelContext=createContext<ColorChannel|null>(null)
export function useColorPicker(){const value=use(ColorPickerContext);if(!value)throw new Error('ColorPicker parts must be used inside ColorPickerRoot.');return value}
export function useGradientPicker(){const value=use(GradientPickerContext);if(!value)throw new Error('GradientPicker parts must be used inside GradientPickerRoot.');return value}
export function useColorPickerArea(){const value=use(ColorPickerAreaContext);if(!value)throw new Error('ColorPickerAreaThumb must be used inside ColorPickerArea.');return value}
export function useColorPickerChannel(){const value=use(ColorPickerChannelContext);if(!value)throw new Error('ColorPickerChannel parts must be used inside ColorPickerChannel.');return value}
