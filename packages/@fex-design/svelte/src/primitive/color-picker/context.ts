import type { ColorChannel,ColorPickerController,ColorPickerSnapshot } from '@fex-design/core/color-picker/types'
import type { GradientController,GradientSnapshot } from '@fex-design/core/gradient/types'
import { getContext } from 'svelte'
export const colorPickerKey=Symbol('color-picker'),colorAreaKey=Symbol('color-area'),colorChannelKey=Symbol('color-channel')
export const gradientPickerKey=Symbol('gradient-picker')
export interface ColorPickerContext{controller:ColorPickerController;snapshot:()=>ColorPickerSnapshot}
export interface ColorAreaContext{x:()=>ColorChannel;y:()=>ColorChannel}
export function useColorPicker(){const context=getContext<ColorPickerContext>(colorPickerKey);if(!context)throw new Error('ColorPicker parts must be used inside ColorPickerRoot.');return context}
export interface GradientPickerContext{controller:GradientController;snapshot:()=>GradientSnapshot}
export function useGradientPicker(){const context=getContext<GradientPickerContext>(gradientPickerKey);if(!context)throw new Error('GradientPicker parts must be used inside GradientPickerRoot.');return context}
