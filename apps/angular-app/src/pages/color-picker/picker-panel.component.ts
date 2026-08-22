import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core'
import { getColorChannelConfig, getColorChannelValue } from '@fex-design/core/color-picker/channels'
import { parseColor } from '@fex-design/core/color/color'
import type { ColorChannel } from '@fex-design/core/color-picker/types'
import type { ColorFormat } from '@fex-design/core/color/types'
import {
  ColorPickerArea,
  ColorPickerAreaThumb,
  ColorPickerChannel,
  ColorPickerChannelThumb,
  ColorPickerChannelTrack,
  ColorPickerRoot,
  ColorPickerSwatch,
} from '@fex-design/angular/primitive/color-picker'
import { InputControl, InputRoot } from '@fex-design/angular/primitive/input'
import { InputNumber, InputNumberSuffix, type InputNumberChange } from '@fex-design/angular/primitive/input-number'
import {
  SelectContent,
  SelectList,
  SelectRoot,
  SelectTrigger,
} from '@fex-design/angular/primitive/select'
@Component({
  selector: 'fex-color-picker-panel-demo',
  standalone: true,
  imports: [
    ColorPickerArea,
    ColorPickerAreaThumb,
    ColorPickerChannel,
    ColorPickerChannelThumb,
    ColorPickerChannelTrack,
    ColorPickerSwatch,
    InputRoot,
    InputControl,
    InputNumber,
    InputNumberSuffix,
    SelectRoot,
    SelectTrigger,
    SelectContent,
    SelectList,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './picker-panel.component.html',
})
export class PickerPanelDemoComponent {
  alpha = input(true)
  clear = input(false)
  oklch = input(false)
  protected readonly options = [
    { value: 'hex', label: 'HEX' },
    { value: 'rgb', label: 'RGB' },
    { value: 'hsl', label: 'HSL' },
    { value: 'hsb', label: 'HSB' },
    { value: 'oklch', label: 'OKLCH' },
  ]
  protected readonly draft = signal('')
  protected readonly editing = signal(false)
  constructor(protected readonly picker: ColorPickerRoot) {}
  protected fields(): ColorChannel[] {
    const f = this.picker.snapshot().format
    return f === 'rgb'
      ? ['red', 'green', 'blue']
      : f === 'hsl'
        ? ['hsl-hue', 'hsl-saturation', 'hsl-lightness']
        : f === 'hsb'
          ? ['hsb-hue', 'hsb-saturation', 'hsb-brightness']
          : f === 'oklch'
            ? ['oklch-lightness', 'oklch-chroma', 'oklch-hue']
            : []
  }
  protected config(channel: ColorChannel) {
    return getColorChannelConfig(channel)
  }
  protected channelValue(channel: ColorChannel) {
    const value = this.picker.snapshot().value
    return value ? getColorChannelValue(value, channel) : undefined
  }
  protected text() {
    return this.editing() ? this.draft() : (this.picker.snapshot().value?.toHex() ?? '')
  }
  protected beginText() {
    this.draft.set(this.picker.snapshot().value?.toHex() ?? '')
    this.editing.set(true)
    this.picker.controller.beginInteraction({ source: 'text-input' })
  }
  protected editText(next: string) {
    this.draft.set(next)
    const parsed = parseColor(next)
    if (parsed) this.picker.controller.setValue(parsed, 'text-input')
  }
  protected commitText() {
    const parsed = parseColor(this.draft())
    if (parsed) this.picker.controller.setValue(parsed, 'text-input', true)
    this.editing.set(false)
  }
  protected setFormat(value: unknown) {
    this.picker.controller.setFormat(value as ColorFormat)
  }
  protected setChannel(channel: ColorChannel, value: string) {
    this.picker.controller.setChannel(channel, Number(value), 'field')
  }
  protected changeChannel(channel: ColorChannel, change: InputNumberChange) {
    if (change.value !== undefined) this.picker.controller.setChannel(channel, change.value, 'field')
  }
}
