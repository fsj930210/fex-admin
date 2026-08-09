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
  createEffect,
  createMemo,
  createSignal,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { MinusIcon } from '../../icon/minus'
import { PlusIcon } from '../../icon/plus'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'

export type InputNumberChangeEvent = InputEvent | FocusEvent | MouseEvent | KeyboardEvent

export interface InputNumberProps extends Omit<
  JSX.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'onInput'
> {
  value?: number
  defaultValue?: number
  min?: number
  max?: number
  step?: number
  precision?: number
  parser?: InputNumberParser
  formatter?: InputNumberFormatter
  clearable?: boolean
  prefix?: JSX.Element
  suffix?: JSX.Element
  invalid?: boolean
  status?: 'error' | 'warning'
  onChange?: (event: InputNumberChangeEvent, value: number | undefined) => void
}

export function InputNumber(props: ParentProps<InputNumberProps>) {
  const controlled = Object.prototype.hasOwnProperty.call(props, 'value')
  const [local, inputProps] = splitProps(props, [
    'value',
    'defaultValue',
    'min',
    'max',
    'step',
    'precision',
    'parser',
    'formatter',
    'clearable',
    'prefix',
    'suffix',
    'invalid',
    'status',
    'disabled',
    'readOnly',
    'onChange',
    'onBlur',
    'onKeyDown',
    'class',
  ])
  const parser = () => local.parser ?? defaultInputNumberParser
  const formatter = () => local.formatter ?? defaultInputNumberFormatter
  const constraints = () => ({
    min: local.min,
    max: local.max,
    step: local.step,
    precision: local.precision,
  })
  const [internalValue, setInternalValue] = createSignal(local.defaultValue)
  const value = createMemo(() => (controlled ? local.value : internalValue()))
  const [draft, setDraft] = createSignal(formatter()(value(), { userTyping: false, input: '' }))
  // Keep the editable buffer aligned with external controlled values.
  createEffect(() => {
    if (controlled)
      setDraft(
        formatter()(local.value, {
          userTyping: false,
          input: local.value === undefined ? '' : String(local.value),
        }),
      )
  })
  const outOfRange = createMemo(() => isInputNumberOutOfRange(value(), constraints()))
  const canIncrement = createMemo(
    () =>
      !local.disabled &&
      !local.readOnly &&
      (local.max === undefined || value() === undefined || value()! < local.max),
  )
  const canDecrement = createMemo(
    () =>
      !local.disabled &&
      !local.readOnly &&
      (local.min === undefined || value() === undefined || value()! > local.min),
  )

  const setValue = (next: number | undefined) => {
    if (!controlled) setInternalValue(next)
  }
  const input = (text: string, event?: InputEvent) => {
    setDraft(text)
    const next = parser()(text)
    if (text.trim() === '' || next !== undefined) {
      setValue(next)
      if (event) local.onChange?.(event, next)
    }
  }
  const commit = (next: number | undefined) => {
    const normalized = next === undefined ? undefined : normalizeInputNumber(next, constraints())
    setValue(normalized)
    setDraft(formatter()(normalized, { userTyping: false, input: draft() }))
    return normalized
  }
  const stepBy = (event: MouseEvent | KeyboardEvent, direction: 'increment' | 'decrement') => {
    const next = commit(stepInputNumber(parser()(draft()) ?? value(), direction, constraints()))
    local.onChange?.(event, next)
  }

  return (
    <InputRoot
      value={draft()}
      disabled={local.disabled}
      readOnly={local.readOnly}
      invalid={local.invalid}
      status={local.status}
      class={local.class}
      data-out-of-range={outOfRange() || undefined}
      onValueChange={(text, meta) => input(text, meta.event)}
    >
      {local.prefix !== undefined && <InputPrefix>{local.prefix}</InputPrefix>}
      <InputControl
        {...inputProps}
        type="text"
        role="spinbutton"
        aria-valuemin={local.min}
        aria-valuemax={local.max}
        aria-valuenow={value()}
        onBlur={(event) => {
          if (typeof local.onBlur === 'function') local.onBlur(event)
          if (event.defaultPrevented) return
          const before = value()
          const next = commit(parser()(draft()) ?? before)
          if (next !== before) local.onChange?.(event, next)
        }}
        onKeyDown={(event) => {
          if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
          if (event.defaultPrevented || local.disabled || local.readOnly) return
          if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
            event.preventDefault()
            stepBy(event, event.key === 'ArrowUp' ? 'increment' : 'decrement')
          }
        }}
      />
      {local.clearable && (
        <InputClear
          aria-label="Clear input"
          onClick={(event) => local.onChange?.(event, commit(undefined))}
        />
      )}
      {local.suffix !== undefined ? (
        <InputSuffix>{local.suffix}</InputSuffix>
      ) : (
        <InputSuffix class={inputNumberActionsClassName}>
          <button
            type="button"
            aria-label="Increase value"
            data-action="increment"
            disabled={!canIncrement()}
            class={inputNumberIncrementClassName}
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => stepBy(event, 'increment')}
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            aria-label="Decrease value"
            data-action="decrement"
            disabled={!canDecrement()}
            class={inputNumberDecrementClassName}
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => stepBy(event, 'decrement')}
          >
            <MinusIcon />
          </button>
        </InputSuffix>
      )}
    </InputRoot>
  )
}
