import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Input,
  signal,
  type AfterViewInit,
} from '@angular/core'
import type { CalendarValue } from '@fex/components-core/calendar'
import { formatDatePickerValue, parseDatePickerValue } from '@fex/components-core/date-picker/value'
import {
  datePickerMultipleInputClassName,
  datePickerTriggerClassName,
} from '@fex/components-styles/date-picker'
import { cn } from '@fex/utils'
import { CalendarIcon } from '../../icon/calendar'
import { InputClear, InputControl, InputRoot, InputPrefix, InputSuffix } from '../input/input'
import { DatePickerRoot } from './date-picker-root'
import { DatePickerTags } from './date-picker-tags'
import { DatePickerState } from './use-date-picker'

@Component({
  selector: 'fex-date-picker-trigger',
  standalone: true,
  imports: [InputRoot, InputControl, InputClear, InputPrefix, InputSuffix, CalendarIcon, DatePickerTags],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { 'data-slot': 'date-picker-trigger', class: 'inline-block' },
  templateUrl: './date-picker-trigger.html',
})
export class DatePickerTrigger implements AfterViewInit {
  @Input() placeholder: string | undefined = undefined
  @Input('displayValue') displayValueInput: string | undefined = undefined
  @Input() prefix: string | undefined = undefined
  @Input() suffix: string | undefined = undefined
  @Input('class') className: string | undefined = undefined
  protected readonly text = signal('')

  constructor(
    private readonly root: DatePickerRoot,
    readonly state: DatePickerState,
    private readonly elementRef: ElementRef<HTMLElement>,
  ) {}

  ngAfterViewInit() {
    this.root.registerTrigger(this.elementRef.nativeElement)
  }

  rootClassName() {
    return cn(datePickerTriggerClassName, this.className)
  }

  displayValue() {
    const context = this.state.context()
    const value = Array.isArray(context.value)
      ? context.value.map((item) => formatDatePickerValue(item, context)).join(', ')
      : formatDatePickerValue(context.value as CalendarValue | null, context)
    return this.displayValueInput ?? value
  }

  inputValue() {
    return this.state.multiple() ? '' : this.text() || this.displayValue()
  }

  inputClassName() {
    return cn(this.state.multiple() && this.displayValue() && datePickerMultipleInputClassName)
  }

  showSuffix() {
    return !this.state.context().allowClear || !this.displayValue()
  }

  open(input: HTMLInputElement, event?: Event) {
    if (this.state.context().disabled) {
      event?.preventDefault()
      event?.stopPropagation()
      return
    }
    input.focus()
    this.state.openPanel()
  }

  input(text: string) {
    this.text.set(text)
    const context = this.state.context()
    if (context.multiple) return
    const result = parseDatePickerValue(text, context)
    if (result.valid) context.select(result.value)
  }

  clear(event?: Event) {
    event?.stopPropagation()
    this.text.set('')
    this.state.clear()
  }
}
