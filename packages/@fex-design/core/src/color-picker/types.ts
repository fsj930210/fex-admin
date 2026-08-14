import type { ColorFormat, ColorInput, ColorValue } from '../color/types'

export type ColorChannel = 'red' | 'green' | 'blue' | 'hsl-hue' | 'hsl-saturation' | 'hsl-lightness' | 'hsb-hue' | 'hsb-saturation' | 'hsb-brightness' | 'oklch-lightness' | 'oklch-chroma' | 'oklch-hue' | 'alpha'
export type ColorChangeSource = 'area' | 'channel' | 'field' | 'text-input' | 'preset' | 'clear'
export interface ColorChangeDetail { format: ColorFormat; formattedValue: string | null; source: ColorChangeSource }
export interface ColorInteraction { source: ColorChangeSource }
export interface ColorPickerSnapshot { value: ColorValue | null; format: ColorFormat; disabled: boolean; interaction: ColorInteraction | null }
export interface ColorPickerOptions {
  value?: ColorInput | null; defaultValue?: ColorInput | null; format?: ColorFormat; defaultFormat?: ColorFormat; disabled?: boolean
  onChange?: (value: ColorValue | null, detail: ColorChangeDetail) => void
  onChangeComplete?: (value: ColorValue | null, detail: ColorChangeDetail) => void
  onFormatChange?: (format: ColorFormat) => void
}
export interface ColorPickerController {
  getSnapshot: () => ColorPickerSnapshot; subscribe: (listener: () => void) => () => void; syncSnapshot: () => void
  setOptions: (options: ColorPickerOptions) => void; setValue: (value: ColorInput | null, source: ColorChangeSource, complete?: boolean) => void
  setFormat: (format: ColorFormat) => void; setChannel: (channel: ColorChannel, value: number, source?: ColorChangeSource, complete?: boolean) => void
  setAreaChannels: (xChannel: ColorChannel, xValue: number, yChannel: ColorChannel, yValue: number) => void
  beginInteraction: (interaction: ColorInteraction) => void; completeInteraction: () => void; clear: () => void
}
