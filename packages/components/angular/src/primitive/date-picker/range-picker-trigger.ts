import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  signal,
  type AfterViewInit,
} from '@angular/core'
import type { CalendarValue } from '@fex/components-core/calendar'
import { getRangePickerDisplayTexts } from '@fex/components-core/date-picker/input'
import { getRangeInputPreviewValue } from '@fex/components-core/date-picker/range'
import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerRangeInputClassName,
  datePickerRangeInputControlClassName,
  datePickerRangeSeparatorClassName,
  datePickerRangeTriggerClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { CalendarIcon } from '../../icon/calendar'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'
import { RangePickerRoot } from './range-picker-root'
import { RangePickerState } from './use-range-picker'

@Component({
  selector: 'fex-range-picker-trigger',
  standalone: true,
  imports: [InputRoot, InputControl, InputClear, InputSuffix, CalendarIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'range-picker-trigger', class: 'inline-block' },
  templateUrl: './range-picker-trigger.html',
})
export class RangePickerTrigger implements AfterViewInit {
  @Input() startPlaceholder = '开始日期'
  @Input() endPlaceholder = '结束日期'
  @Input() separator = '→'
  @Input() suffix: string | undefined = undefined
  @Input() status: 'error' | 'warning' | undefined = undefined
  @Input('class') className: string | undefined = undefined
  protected readonly focusedPart = signal<'start' | 'end' | null>(null)
  protected readonly triggerClassName = datePickerRangeTriggerClassName
  protected readonly rangeInputClassName = datePickerRangeInputClassName
  protected readonly rangeSeparatorClassName = datePickerRangeSeparatorClassName

  constructor(
    private readonly root: RangePickerRoot,
    readonly state: RangePickerState,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    this.root.registerTrigger(this.elementRef.nativeElement)
  }

  previewStartValue() {
    const context = this.state.context()
    return getRangeInputPreviewValue(
      context.rangeValue,
      context.hoverValue,
      context.activePart,
      'start',
    )
  }

  previewEndValue() {
    const context = this.state.context()
    return getRangeInputPreviewValue(
      context.rangeValue,
      context.hoverValue,
      context.activePart,
      'end',
    )
  }

  startText() {
    const context = this.state.context()
    const value =
      context.activePart === 'start' && this.previewStartValue()
        ? this.previewStartValue()
        : context.rangeValue.start
    return value ? formatDatePickerValue(value, context) : ''
  }

  endText() {
    const context = this.state.context()
    const value =
      context.activePart === 'end' && this.previewEndValue()
        ? this.previewEndValue()
        : context.rangeValue.end
    return value ? formatDatePickerValue(value, context) : ''
  }

  startPreviewing() {
    const context = this.state.context()
    const committed = context.rangeValue.start
      ? formatDatePickerValue(context.rangeValue.start, context)
      : ''
    return this.startText() !== committed
  }

  endPreviewing() {
    const context = this.state.context()
    const committed = context.rangeValue.end
      ? formatDatePickerValue(context.rangeValue.end, context)
      : ''
    return this.endText() !== committed
  }

  inputClassName(part: 'start' | 'end') {
    return cn(
      datePickerRangeInputControlClassName,
      '!text-left',
      (part === 'start' ? this.startPreviewing() : this.endPreviewing()) && 'text-muted-foreground',
    )
  }

  rootValue() {
    return getRangePickerDisplayTexts(this.state.context().rangeValue, this.state.context()).join(
      '',
    )
  }

  hasValue() {
    const context = this.state.context()
    return Boolean(context.rangeValue.start || context.rangeValue.end)
  }

  openPart(part: 'start' | 'end', input?: HTMLInputElement, event?: Event) {
    const context = this.state.context()
    if (context.disabled) {
      event?.preventDefault()
      event?.stopPropagation()
      return
    }
    if (event?.type === 'focus' && context.open) return
    this.focusedPart.set(part)
    this.state.setActivePart(part)
    this.state.openPanel(part)
    input?.focus()
  }

  openFromTrigger(event: MouseEvent) {
    const part = (event.target as HTMLElement | null)
      ?.closest('[data-range-part]')
      ?.getAttribute('data-range-part')
    this.openPart(part === 'start' || part === 'end' ? part : this.state.context().activePart)
  }

  input(part: 'start' | 'end', text: string) {
    this.focusedPart.set(part)
    this.state.setActivePart(part)
    this.state.setHoverValue(null)
    const result = parseDatePickerValue(text, this.state.context())
    if (result.valid) this.state.select(result.value as CalendarValue)
  }

  blur(event: FocusEvent) {
    if (!(event.currentTarget as HTMLElement).contains(event.relatedTarget as Node | null)) {
      this.focusedPart.set(null)
    }
  }

  clear(event?: Event) {
    event?.stopPropagation()
    this.state.clear()
  }
}
