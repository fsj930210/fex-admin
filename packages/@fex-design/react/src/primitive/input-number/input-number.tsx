import {
  inputNumberActionsClassName,
  inputNumberDecrementClassName,
  inputNumberIncrementClassName,
} from '@fex-design/styles/input-number'
import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { MinusIcon } from '../../icon/minus'
import { PlusIcon } from '../../icon/plus'
import { InputClear, InputControl, InputPrefix, InputRoot, InputSuffix } from '../input/input'
import { useInputNumber, type UseInputNumberOptions } from './use-input-number'

export type InputNumberChangeEvent =
  | ChangeEvent<HTMLInputElement>
  | FocusEvent<HTMLInputElement>
  | MouseEvent<HTMLButtonElement>

export interface InputNumberProps
  extends
    Omit<
      ComponentProps<'input'>,
      'value' | 'defaultValue' | 'type' | 'onChange' | 'disabled' | 'readOnly' | 'prefix'
    >,
    UseInputNumberOptions {
  clearable?: boolean | undefined
  prefix?: ReactNode
  suffix?: ReactNode
  invalid?: boolean | undefined
  status?: 'error' | 'warning' | undefined
  onChange?: ((event: InputNumberChangeEvent, value: number | undefined) => void) | undefined
  ref?: Ref<HTMLInputElement> | undefined
}

export function InputNumber(inputNumberProps: InputNumberProps) {
  const controlled = Object.prototype.hasOwnProperty.call(inputNumberProps, 'value')
  const {
    value,
    defaultValue,
    min,
    max,
    step,
    precision,
    parser,
    formatter,
    disabled,
    readOnly,
    clearable = false,
    prefix,
    suffix,
    invalid,
    status,
    className,
    onChange,
    onFocus,
    onBlur,
    onKeyDown,
    ref,
    ...inputProps
  } = inputNumberProps
  const inputNumber = useInputNumber({
    value,
    defaultValue,
    min,
    max,
    step,
    precision,
    parser,
    formatter,
    disabled,
    readOnly,
    controlled,
  })

  const commitStep = (
    event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLInputElement>,
    direction: 'increment' | 'decrement',
  ) => {
    const nextValue = direction === 'increment' ? inputNumber.increment() : inputNumber.decrement()
    onChange?.(event as InputNumberChangeEvent, nextValue)
  }

  return (
    <InputRoot
      value={inputNumber.draft}
      disabled={disabled}
      readOnly={readOnly}
      invalid={invalid}
      status={status}
      data-out-of-range={inputNumber.outOfRange ? 'true' : undefined}
      className={className}
      onValueChange={(text, meta) => {
        if (meta.reason !== 'input') return
        const nextValue = inputNumber.setDraftValue(text)
        if (text.trim() === '' || nextValue !== undefined) {
          onChange?.(meta.event as ChangeEvent<HTMLInputElement>, nextValue)
        }
      }}
    >
      {prefix !== undefined && <InputPrefix>{prefix}</InputPrefix>}
      <InputControl
        {...inputProps}
        ref={ref}
        type="text"
        role="spinbutton"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={inputNumber.value}
        disabled={disabled}
        readOnly={readOnly}
        onFocus={(event) => {
          onFocus?.(event)
        }}
        onBlur={(event) => {
          onBlur?.(event)
          if (event.defaultPrevented) return
          const parsed = inputNumber.parseDraft()
          const nextValue = inputNumber.commit(parsed ?? inputNumber.value)
          if (nextValue !== inputNumber.value) onChange?.(event, nextValue)
        }}
        onKeyDown={(event) => {
          onKeyDown?.(event)
          if (event.defaultPrevented || disabled || readOnly) return
          if (event.key === 'ArrowUp') {
            event.preventDefault()
            commitStep(event, 'increment')
          } else if (event.key === 'ArrowDown') {
            event.preventDefault()
            commitStep(event, 'decrement')
          }
        }}
      />
      {clearable && (
        <InputClear
          onClick={(event) => {
            const nextValue = inputNumber.clear()
            onChange?.(event, nextValue)
          }}
        />
      )}
      {suffix === undefined ? (
        <InputSuffix className={inputNumberActionsClassName}>
          <button
            type="button"
            aria-label="Increase value"
            data-action="increment"
            disabled={!inputNumber.canIncrement}
            className={inputNumberIncrementClassName}
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => commitStep(event, 'increment')}
          >
            <PlusIcon />
          </button>
          <button
            type="button"
            aria-label="Decrease value"
            data-action="decrement"
            disabled={!inputNumber.canDecrement}
            className={inputNumberDecrementClassName}
            onPointerDown={(event) => event.preventDefault()}
            onClick={(event) => commitStep(event, 'decrement')}
          >
            <MinusIcon />
          </button>
        </InputSuffix>
      ) : suffix === null ? null : (
        <InputSuffix>{suffix}</InputSuffix>
      )}
    </InputRoot>
  )
}
