import { createWatermarkController } from '@fex-design/core/watermark/create-watermark-controller'
import type { WatermarkFont, WatermarkOptions } from '@fex-design/core/watermark/types'
import { watermarkRootClassName } from '@fex-design/styles/watermark'
import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  afterNextRender,
  effect,
  input,
  inject,
} from '@angular/core'
import type { OnDestroy } from '@angular/core'
import { createHostClassName } from '../../signals/host-class'

@Component({
  selector: 'fex-watermark',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class]': 'hostClassName()',
    'data-slot': 'watermark-root',
  },
  template: '<ng-content />',
})
export class Watermark implements OnDestroy {
  readonly content = input<WatermarkOptions['content']>()
  readonly width = input<number>()
  readonly height = input<number>()
  readonly rotate = input<number>()
  readonly gap = input<[number, number]>()
  readonly offset = input<[number, number]>()
  readonly zIndex = input<number>()
  readonly opacity = input<number>()
  readonly font = input<WatermarkFont>()
  protected readonly hostClassName = createHostClassName(watermarkRootClassName)
  private readonly elementRef = inject<ElementRef<HTMLElement>>(ElementRef)
  private cleanup: (() => void) | undefined
  private connected = false

  constructor() {
    afterNextRender(() => {
      this.connected = true
      this.connect()
    })
    effect(() => {
      this.content()
      this.width()
      this.height()
      this.rotate()
      this.gap()
      this.offset()
      this.zIndex()
      this.opacity()
      this.font()
      if (this.connected) {
        this.connect()
      }
    })
  }

  ngOnDestroy() {
    this.cleanup?.()
  }

  private connect() {
    if (typeof window === 'undefined') return
    this.cleanup?.()
    const options: WatermarkOptions = {}
    const content = this.content()
    const width = this.width()
    const height = this.height()
    const rotate = this.rotate()
    const gap = this.gap()
    const offset = this.offset()
    const zIndex = this.zIndex()
    const opacity = this.opacity()
    const font = this.font()
    if (content !== undefined) options.content = content
    if (width !== undefined) options.width = width
    if (height !== undefined) options.height = height
    if (rotate !== undefined) options.rotate = rotate
    if (gap !== undefined) options.gap = gap
    if (offset !== undefined) options.offset = offset
    if (zIndex !== undefined) options.zIndex = zIndex
    if (opacity !== undefined) options.opacity = opacity
    if (font !== undefined) options.font = font
    this.cleanup = createWatermarkController(options).connect(this.elementRef.nativeElement)
  }
}
