import { NgTemplateOutlet } from '@angular/common'
import {
  booleanAttribute,
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  input,
  numberAttribute,
  output,
  type TemplateRef,
} from '@angular/core'
import { createRateController } from '@fex-design/core/rate/create-rate-controller'
import type { RateDirection } from '@fex-design/core/rate/types'
import { getRateItemFill } from '@fex-design/core/rate/utils'
import {
  rateEmptyContentClassName,
  rateFilledContentClassName,
  rateItemClassName,
  rateRootClassName,
} from '@fex-design/styles/rate'
import { cn } from '@fex/utils'
import { StarIcon } from '../../icon/star'
import { createCoreStoreSignal } from '../../signals/core-store-signal'
import { createHostClassName } from '../../signals/host-class'
import { getRatePointerValue } from './rate-interactions'

export type RateSize = 'sm' | 'default' | 'lg'
export interface RateItemRenderState {
  index: number
  layer: 'empty' | 'filled'
  fill: number
  fillPercent: number
  full: boolean
  partial: boolean
  empty: boolean
  previewing: boolean
  disabled: boolean
  readOnly: boolean
}
function optionalNumberAttribute(value: unknown) {
  return value === undefined || value === null || value === '' ? undefined : numberAttribute(value)
}

@Component({
  selector: 'fex-rate',
  standalone: true,
  imports: [NgTemplateOutlet, StarIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './rate.html',
  host: {
    '[class]': 'hostClassName()',
    role: 'slider',
    '[attr.tabindex]': 'snapshot().disabled ? null : 0',
    '[attr.dir]': 'snapshot().direction',
    '[attr.aria-valuemin]': '0',
    '[attr.aria-valuemax]': 'snapshot().count',
    '[attr.aria-valuenow]': 'snapshot().value',
    '[attr.aria-valuetext]': 'valueText()',
    '[attr.aria-disabled]': 'snapshot().disabled || null',
    '[attr.aria-readonly]': 'snapshot().readOnly || null',
    '[attr.data-disabled]': "snapshot().disabled ? 'true' : null",
    '[attr.data-readonly]': 'snapshot().readOnly',
    '(pointerdown)': 'handlePointerDown($event)',
    '(pointermove)': 'handlePointerMove($event)',
    '(pointerup)': 'handlePointerUp($event)',
    '(pointercancel)': 'controller.cancelInteraction()',
    '(pointerleave)': 'controller.clearPreview()',
    '(pointerout)': 'handlePointerOut($event)',
    '(keydown)': 'handleKeydown($event)',
  },
})
export class Rate {
  value = input<number | undefined, unknown>(undefined, { transform: optionalNumberAttribute })
  defaultValue = input<number | undefined, unknown>(undefined, {
    transform: optionalNumberAttribute,
  })
  count = input(5, { transform: numberAttribute })
  step = input(1, { transform: numberAttribute })
  disabled = input(false, { transform: booleanAttribute })
  readOnly = input(false, { transform: booleanAttribute })
  allowClear = input(true, { transform: booleanAttribute })
  direction = input<RateDirection>('ltr')
  size = input<RateSize>('default')
  getValueText = input<((value: number, count: number) => string) | undefined>()
  content = input<TemplateRef<{ $implicit: RateItemRenderState }> | undefined>()
  valuePreviewChange = output<number | null>()
  valueChange = output<number>()
  valueCommit = output<number>()

  private readonly element = inject<ElementRef<HTMLElement>>(ElementRef).nativeElement
  readonly controller
  readonly snapshot
  protected readonly hostClassName
  protected readonly indices
  protected readonly valueText
  protected readonly rateItemClassName = rateItemClassName
  protected readonly rateEmptyContentClassName = rateEmptyContentClassName
  protected readonly rateFilledContentClassName = rateFilledContentClassName

  constructor() {
    const value = this.value
    const defaultValue = this.defaultValue
    const count = this.count
    const step = this.step
    const disabled = this.disabled
    const readOnly = this.readOnly
    const allowClear = this.allowClear
    const direction = this.direction
    this.controller = createRateController({
      get value() {
        return value()
      },
      get defaultValue() {
        return defaultValue()
      },
      get count() {
        return count()
      },
      get step() {
        return step()
      },
      get disabled() {
        return disabled()
      },
      get readOnly() {
        return readOnly()
      },
      get allowClear() {
        return allowClear()
      },
      get direction() {
        return direction()
      },
      onPreviewChange: (nextValue) => this.valuePreviewChange.emit(nextValue),
      onChange: (nextValue) => this.valueChange.emit(nextValue),
      onCommit: (nextValue) => this.valueCommit.emit(nextValue),
    })
    const storeSnapshot = createCoreStoreSignal(this.controller)
    this.snapshot = computed(() => {
      storeSnapshot()
      return this.controller.getSnapshot()
    })
    this.hostClassName = createHostClassName(() => cn(rateRootClassName({ size: this.size() })))
    this.indices = computed(() =>
      Array.from({ length: this.snapshot().count }, (_, index) => index),
    )
    this.valueText = computed(
      () =>
        this.getValueText()?.(this.snapshot().value, this.snapshot().count) ??
        `${this.snapshot().value} out of ${this.snapshot().count}`,
    )
  }
  protected itemState(index: number, layer: 'empty' | 'filled'): RateItemRenderState {
    const snapshot = this.snapshot()
    const fill = getRateItemFill(snapshot.displayValue, index)
    return {
      index,
      layer,
      fill,
      fillPercent: fill * 100,
      full: fill === 1,
      partial: fill > 0 && fill < 1,
      empty: fill === 0,
      previewing: snapshot.previewValue !== null,
      disabled: snapshot.disabled,
      readOnly: snapshot.readOnly,
    }
  }
  protected clipPath(index: number) {
    const hidden = (1 - getRateItemFill(this.snapshot().displayValue, index)) * 100
    return this.snapshot().direction === 'rtl'
      ? `inset(0 0 0 ${hidden}%)`
      : `inset(0 ${hidden}% 0 0)`
  }
  private pointerValue(event: PointerEvent) {
    const snapshot = this.snapshot()
    return getRatePointerValue(
      this.element,
      event.clientX,
      snapshot.step,
      snapshot.count,
      snapshot.direction,
    )
  }
  handlePointerDown(event: PointerEvent) {
    const snapshot = this.snapshot()
    if (event.defaultPrevented || snapshot.disabled || snapshot.readOnly) return
    this.element.setPointerCapture(event.pointerId)
    this.controller.startInteraction(this.pointerValue(event))
  }
  handlePointerMove(event: PointerEvent) {
    const snapshot = this.snapshot()
    if (event.defaultPrevented || snapshot.disabled || snapshot.readOnly) return
    const value = this.pointerValue(event)
    if (snapshot.interacting) this.controller.moveInteraction(value)
    else this.controller.preview(value)
  }
  handlePointerUp(event: PointerEvent) {
    if (this.element.hasPointerCapture(event.pointerId))
      this.element.releasePointerCapture(event.pointerId)
    this.controller.commitInteraction()
  }
  handlePointerOut(event: PointerEvent) {
    if (event.relatedTarget instanceof Node && this.element.contains(event.relatedTarget)) return
    this.controller.clearPreview()
  }
  handleKeydown(event: KeyboardEvent) {
    const snapshot = this.snapshot()
    if (snapshot.disabled || snapshot.readOnly) return
    const horizontal = snapshot.direction === 'rtl' ? -1 : 1
    const directions: Record<string, number> = {
      ArrowRight: horizontal,
      ArrowLeft: -horizontal,
      ArrowUp: 1,
      ArrowDown: -1,
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault()
      this.controller.setValue(event.key === 'Home' ? 0 : snapshot.count, { commit: true })
    } else if (event.key === 'PageUp' || event.key === 'PageDown') {
      event.preventDefault()
      this.controller.stepValue(event.key === 'PageUp' ? 1 : -1, 10)
    } else if (event.key in directions) {
      event.preventDefault()
      this.controller.stepValue(directions[event.key]!)
    }
  }
}
