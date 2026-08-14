import type { ColorChannel,ColorPickerController,ColorPickerSnapshot } from '@fex-design/core/color-picker/types'
import type { GradientController,GradientSnapshot } from '@fex-design/core/gradient/types'
import { inject,type ComputedRef,type InjectionKey } from 'vue'
export const colorPickerKey:InjectionKey<{controller:ColorPickerController;snapshot:ComputedRef<ColorPickerSnapshot>}>=Symbol('color-picker')
export const colorAreaKey:InjectionKey<{xChannel:ComputedRef<ColorChannel>;yChannel:ComputedRef<ColorChannel>}>=Symbol('color-area')
export const colorChannelKey:InjectionKey<ComputedRef<ColorChannel>>=Symbol('color-channel')
export const gradientPickerKey:InjectionKey<{controller:GradientController;snapshot:ComputedRef<GradientSnapshot>}>=Symbol('gradient-picker')
export function useColorPicker(){const value=inject(colorPickerKey);if(!value)throw new Error('ColorPicker parts must be used inside ColorPickerRoot.');return value}
export function useColorArea(){const value=inject(colorAreaKey);if(!value)throw new Error('ColorPickerAreaThumb must be used inside ColorPickerArea.');return value}
export function useColorChannel(){const value=inject(colorChannelKey);if(!value)throw new Error('ColorPickerChannel parts must be used inside ColorPickerChannel.');return value}
export function useGradientPicker(){const value=inject(gradientPickerKey);if(!value)throw new Error('GradientPicker parts must be used inside GradientPickerRoot.');return value}
