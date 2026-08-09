import type { InputNumberFormatter, InputNumberParser } from '@fex-design/core/input-number/types'
import {
  defaultInputNumberFormatter,
  defaultInputNumberParser,
  isInputNumberOutOfRange,
  normalizeInputNumber,
  stepInputNumber,
} from '@fex-design/core/input-number/value'
import {
  inputNumberActionsClassName,
  inputNumberDecrementClassName,
  inputNumberIncrementClassName,
} from '@fex-design/styles/input-number'
import {
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  Directive,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core'
import type { OnChanges, SimpleChanges } from '@angular/core'
import { MinusIcon } from '../../icon/minus'
import { PlusIcon } from '../../icon/plus'
import { InputClear, InputControl, InputRoot, InputSuffix } from '../input/input'

@Directive({ selector: '[fexInputNumberSuffix]', standalone: true })
export class InputNumberSuffix {}

export interface InputNumberChange {
  event: Event
  value: number | undefined
}

@Component({
  selector: 'fex-input-number',
  standalone: true,
  imports: [InputRoot, InputControl, InputClear, InputSuffix, MinusIcon, PlusIcon],
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { class: 'contents' },
  templateUrl: './input-number.html',
})
export class InputNumber implements OnChanges {
  private controlled = false
  @Input() value: number | undefined
  @Input() defaultValue: number | undefined
  @Input() min: number | undefined
  @Input() max: number | undefined
  @Input() step = 1
  @Input() precision: number | undefined
  @Input() parser: InputNumberParser = defaultInputNumberParser
  @Input() formatter: InputNumberFormatter = defaultInputNumberFormatter
  @Input() disabled = false
  @Input() readOnly = false
  @Input() invalid = false
  @Input() status: 'error' | 'warning' | undefined
  @Input() clearable = false
  @Input() placeholder: string | undefined
  @Input() name: string | undefined
  @Input() required = false
  @Input('class') className = ''
  @Output() readonly change = new EventEmitter<InputNumberChange>()
  @ContentChild(InputNumberSuffix) customSuffix?: InputNumberSuffix

  protected readonly internalValue = signal<number | undefined>(undefined)
  protected readonly draft = signal('')
  protected readonly inputNumberActionsClassName = inputNumberActionsClassName
  protected readonly inputNumberDecrementClassName = inputNumberDecrementClassName
  protected readonly inputNumberIncrementClassName = inputNumberIncrementClassName

  constructor() {
    this.internalValue.set(this.defaultValue)
    this.draft.set(this.formatter(this.currentValue, { userTyping: false, input: '' }))
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['value']) this.controlled = true
    if (changes['defaultValue'] && !this.controlled) this.internalValue.set(this.defaultValue)
    if (changes['defaultValue'] && !this.controlled)
      this.draft.set(this.formatter(this.currentValue, { userTyping: false, input: this.draft() }))
    if (changes['value'])
      this.draft.set(this.formatter(this.currentValue, { userTyping: false, input: this.draft() }))
  }
  protected get currentValue() {
    return this.controlled ? this.value : this.internalValue()
  }
  protected get constraints() {
    return { min: this.min, max: this.max, step: this.step, precision: this.precision }
  }
  protected get outOfRange() {
    return isInputNumberOutOfRange(this.currentValue, this.constraints)
  }
  protected get canIncrement() {
    return (
      !this.disabled &&
      !this.readOnly &&
      (this.max === undefined || this.currentValue === undefined || this.currentValue < this.max)
    )
  }
  protected get canDecrement() {
    return (
      !this.disabled &&
      !this.readOnly &&
      (this.min === undefined || this.currentValue === undefined || this.currentValue > this.min)
    )
  }

  private setValue(value: number | undefined) {
    if (!this.controlled) this.internalValue.set(value)
  }
  protected handleInput(event: Event) {
    const text = (event.currentTarget as HTMLInputElement).value
    this.draft.set(text)
    const value = this.parser(text)
    if (text.trim() === '' || value !== undefined) {
      this.setValue(value)
      this.change.emit({ event, value })
    }
  }
  protected commit(value: number | undefined) {
    const next = value === undefined ? undefined : normalizeInputNumber(value, this.constraints)
    this.setValue(next)
    this.draft.set(this.formatter(next, { userTyping: false, input: this.draft() }))
    return next
  }
  protected stepBy(event: Event, direction: 'increment' | 'decrement') {
    const value = this.commit(
      stepInputNumber(this.parser(this.draft()) ?? this.currentValue, direction, this.constraints),
    )
    this.change.emit({ event, value })
  }
  protected handleBlur(event: FocusEvent) {
    const before = this.currentValue
    const value = this.commit(this.parser(this.draft()) ?? before)
    if (value !== before) this.change.emit({ event, value })
  }
  protected handleKeydown(event: KeyboardEvent) {
    if (event.defaultPrevented || this.disabled || this.readOnly) return
    if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
      event.preventDefault()
      this.stepBy(event, event.key === 'ArrowUp' ? 'increment' : 'decrement')
    }
  }
  protected clear(event: MouseEvent) {
    this.commit(undefined)
    this.change.emit({ event, value: undefined })
  }
}
