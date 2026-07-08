import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionChangeMeta, SelectionValue } from '@fex/components-core/selection/types'
import {
  radioButtonClassName,
  radioGroupClassName,
  radioIndicatorClassName,
  radioRootClassName,
  type RadioButtonStyleProps,
  type RadioGroupStyleProps,
  type RadioStyleProps,
} from '@fex/components-styles/radio'
import { cn } from '@fex/utils'
import {
  createContext,
  use,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type Ref,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useLazyRef } from '../../hooks/use-lazy-ref'

export type RadioValue = SelectionValue

export interface RadioChangeMeta {
  previousValue: RadioValue | undefined
  value: RadioValue
  changedValues: SelectionChangeMeta['changedValues']
}

export interface RadioGroupProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
    RadioGroupStyleProps {
  value?: RadioValue
  defaultValue?: RadioValue
  disabled?: boolean
  ref?: Ref<HTMLDivElement>
  onValueChange?: (value: RadioValue, meta: RadioChangeMeta) => void
}

export interface RadioProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'defaultValue' | 'onChange' | 'type' | 'value'>,
    RadioStyleProps {
  value: RadioValue
  ref?: Ref<HTMLButtonElement>
}

export interface RadioButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'defaultValue' | 'onChange' | 'type' | 'value'>,
    RadioButtonStyleProps {
  value: RadioValue
  ref?: Ref<HTMLButtonElement>
}

interface RadioContextValue {
  value: RadioValue | undefined
  disabled: boolean
  select: (value: RadioValue) => void
}

const RadioContext = createContext<RadioContextValue | null>(null)

function toRadioChangeMeta(value: RadioValue, meta: SelectionChangeMeta): RadioChangeMeta {
  return {
    previousValue: meta.previousValues[0],
    value,
    changedValues: meta.changedValues,
  }
}

function useRadioContext(componentName: string) {
  const context = use(RadioContext)
  if (context === null) {
    throw new Error(`${componentName} must be used inside RadioGroup.`)
  }
  return context
}

export function RadioGroup({
  value,
  defaultValue,
  disabled = false,
  orientation = 'vertical',
  className,
  ref,
  children,
  onValueChange,
  ...props
}: RadioGroupProps) {
  const optionsRef = useRef({ value, defaultValue, disabled, onValueChange })
  Object.assign(optionsRef.current, { value, defaultValue, disabled, onValueChange })
  const controllerRef = useLazyRef(() =>
    createSelectionController({
      get value() {
        return optionsRef.current.value
      },
      get defaultValue() {
        return optionsRef.current.defaultValue
      },
      get multiple() {
        return false
      },
      onChange(values, meta) {
        const nextValue = values[0]
        if (nextValue === undefined) return
        optionsRef.current.onValueChange?.(nextValue, toRadioChangeMeta(nextValue, meta))
      },
    }),
  )
  const snapshot = useCoreStore(controllerRef.current)
  const currentValue = value ?? snapshot.value

  return (
    <RadioContext
      value={{
        value: currentValue,
        disabled,
        select: (nextValue) => controllerRef.current.replace(nextValue),
      }}
    >
      <div
        {...props}
        ref={ref}
        role="radiogroup"
        data-orientation={orientation}
        data-disabled={disabled ? 'true' : undefined}
        className={cn(radioGroupClassName({ orientation }), className)}
      >
        {children}
      </div>
    </RadioContext>
  )
}

export function Radio({
  value,
  disabled = false,
  size = 'default',
  className,
  ref,
  onClick,
  children,
  ...props
}: RadioProps) {
  const context = useRadioContext('Radio')
  const currentDisabled = context.disabled || disabled
  const checked = context.value === value

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={currentDisabled}
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={currentDisabled ? 'true' : undefined}
      data-value={value}
      className={cn(radioRootClassName({ size }), className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || currentDisabled) return
        context.select(value)
      }}
    >
      {checked ? <span className={radioIndicatorClassName({ size })} /> : null}
      {children}
    </button>
  )
}

export function RadioButton({
  value,
  disabled = false,
  size = 'default',
  className,
  ref,
  onClick,
  children,
  ...props
}: RadioButtonProps) {
  const context = useRadioContext('RadioButton')
  const currentDisabled = context.disabled || disabled
  const checked = context.value === value

  return (
    <button
      {...props}
      ref={ref}
      type="button"
      role="radio"
      aria-checked={checked}
      disabled={currentDisabled}
      data-state={checked ? 'checked' : 'unchecked'}
      data-disabled={currentDisabled ? 'true' : undefined}
      data-value={value}
      className={cn(radioButtonClassName({ size }), className)}
      onClick={(event) => {
        onClick?.(event)
        if (event.defaultPrevented || currentDisabled) return
        context.select(value)
      }}
    >
      {children}
    </button>
  )
}
