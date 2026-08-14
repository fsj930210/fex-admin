import { ChangeDetectionStrategy, Component, computed, signal, viewChild } from '@angular/core'
import Card from '@fex-design/angular/ui/card'
import { Popover, PopoverContent, PopoverTrigger } from '@fex-design/angular/primitive/popover'
import { ChevronDownIcon } from '@fex-design/angular/icon/chevron'
import {
  ColorPickerRoot,
  ColorPickerSwatch,
  GradientPickerRoot,
  GradientPickerStop,
  GradientPickerTrack,
} from '@fex-design/angular/primitive/color-picker'
import type { LinearGradientInput } from '@fex-design/core/gradient/types'
import { formatLinearGradient, normalizeGradient } from '@fex-design/core/gradient/gradient'
import { DemoPickerComponent } from './demo-picker.component'
import { PickerPanelDemoComponent } from './picker-panel.component'
export
@Component({
  selector: 'fex-color-picker-basic-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './basic-demo.component.html',
})
class BasicColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-controlled-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './controlled-demo.component.html',
})
class ControlledColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-gradient-demo',
  standalone: true,
  imports: [Card, GradientPickerRoot, GradientPickerTrack, GradientPickerStop, ColorPickerRoot, PickerPanelDemoComponent, Popover, PopoverContent, PopoverTrigger],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './gradient-demo.component.html',
})
class GradientColorPickerDemoComponent {
  protected readonly initial: LinearGradientInput = {
    type: 'linear-gradient',
    angle: 90,
    interpolation: 'oklch',
    stops: [
      { id: 'start', color: 'rgb(16 142 233)', position: 0 },
      { id: 'end', color: 'rgb(135 208 104)', position: 1 },
    ],
  }
  protected readonly value = signal<LinearGradientInput>(this.initial)
  protected readonly css = signal(formatLinearGradient(normalizeGradient(this.initial)))
  protected readonly gradient = viewChild.required(GradientPickerRoot)
  protected readonly label = computed(() => this.gradient().snapshot().value.stops.map((stop) => `${stop.color.toString('rgb')} ${Math.round(stop.position * 100)}%`).join(', '))
  protected readonly selectedColor = computed(() => this.gradient().snapshot().value.stops.find((stop) => stop.id === this.gradient().snapshot().selectedStopId)?.color)
  protected setSelectedColor(value: { toString: (format: 'oklch') => string } | null) {
    if (value) this.gradient().controller.setStopColor(this.gradient().snapshot().selectedStopId, value.toString('oklch'))
  }
  protected update(event: { value: Parameters<typeof formatLinearGradient>[0] }) {
    this.value.set(event.value)
    this.css.set(formatLinearGradient(event.value))
  }
}
export
@Component({
  selector: 'fex-color-picker-trigger-text-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './trigger-text-demo.component.html',
})
class TriggerTextColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-disabled-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-demo.component.html',
})
class DisabledColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-disabled-alpha-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './disabled-alpha-demo.component.html',
})
class DisabledAlphaColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-clear-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './clear-demo.component.html',
})
class ClearColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-custom-trigger-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-trigger-demo.component.html',
})
class CustomTriggerColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-custom-trigger-event-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-trigger-event-demo.component.html',
})
class CustomTriggerEventColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-format-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './format-demo.component.html',
})
class FormatColorPickerDemoComponent {}
export
@Component({
  selector: 'fex-color-picker-presets-demo',
  standalone: true,
  imports: [Card, ColorPickerRoot, ColorPickerSwatch, PickerPanelDemoComponent, Popover, PopoverContent, PopoverTrigger, ChevronDownIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './presets-demo.component.html',
})
class PresetsColorPickerDemoComponent {
  protected readonly value = signal('#1677FF')
  protected readonly groups = [
    ['primary', ['#E6F4FF', '#91CAFF', '#4096FF', '#1677FF', '#0958D9']],
    ['red', ['#FFF1F0', '#FFA39E', '#FF4D4F', '#F5222D', '#820014']],
    ['green', ['#F6FFED', '#B7EB8F', '#73D13D', '#52C41A', '#135200']],
    ['cyan', ['#E6FFFB', '#87E8DE', '#36CFC9', '#13C2C2', '#00474F']],
  ] as const
}
export
@Component({
  selector: 'fex-color-picker-custom-panel-demo',
  standalone: true, imports: [Card, DemoPickerComponent], changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './custom-panel-demo.component.html',
})
class CustomPanelColorPickerDemoComponent {}
