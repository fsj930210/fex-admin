import { ChangeDetectionStrategy, Component, computed, signal, type WritableSignal } from '@angular/core'
import { InputControl, InputRoot } from '@fex-design/angular/primitive/input'
import {
  SliderRange,
  SliderRoot,
  SliderThumb,
  SliderTrack,
} from '@fex-design/angular/primitive/slider'
import { Watermark } from '@fex-design/angular/primitive/watermark'
import Card from '@fex-design/angular/ui/card'

@Component({
  selector: 'fex-watermark-custom-config-demo',
  standalone: true,
  imports: [
    Card,
    InputRoot,
    InputControl,
    SliderRoot,
    SliderTrack,
    SliderRange,
    SliderThumb,
    Watermark,
  ],
  templateUrl: './custom-config-demo.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomConfigDemo {
  protected readonly content = signal('FEX Admin')
  protected readonly color = signal('rgba(0, 0, 0, 0.15)')
  protected readonly fontSize = signal(18)
  protected readonly zIndex = signal(9)
  protected readonly rotate = signal(-22)
  protected readonly gapX = signal(100)
  protected readonly gapY = signal(100)
  protected readonly offsetX = signal(0)
  protected readonly offsetY = signal(0)
  protected readonly font = computed(() => ({ color: this.color(), fontSize: this.fontSize() }))
  protected readonly gap = computed<[number, number]>(() => [this.gapX(), this.gapY()])
  protected readonly offset = computed<[number, number]>(() => [this.offsetX(), this.offsetY()])

  protected setNumber(target: WritableSignal<number>, value: string) {
    target.set(Number(value) || 0)
  }
}
