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
import { createContext, splitProps, useContext, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'

export type RadioValue = SelectionValue

export interface RadioChangeMeta {
  previousValue: RadioValue | undefined
  value: RadioValue
  changedValues: SelectionChangeMeta['changedValues']
}

export interface RadioGroupProps
  extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>>,
    RadioGroupStyleProps {
  value?: RadioValue
  defaultValue?: RadioValue
  disabled?: boolean
  onValueChange?: (value: RadioValue, meta: RadioChangeMeta) => void
}

export interface RadioProps
  extends ParentProps<Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'defaultValue' | 'onChange' | 'type' | 'value'>>,
    RadioStyleProps {
  value: RadioValue
}

export interface RadioButtonProps
  extends ParentProps<Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'defaultValue' | 'onChange' | 'type' | 'value'>>,
    RadioButtonStyleProps {
  value: RadioValue
}

interface RadioContextValue {
  value: () => RadioValue | undefined
  disabled: () => boolean
  select: (value: RadioValue) => void
}

const RadioContext = createContext<RadioContextValue>()

function toRadioChangeMeta(value: RadioValue, meta: SelectionChangeMeta): RadioChangeMeta {
  return {
    previousValue: meta.previousValues[0],
    value,
    changedValues: meta.changedValues,
  }
}

function useRadioContext(componentName: string) {
  const context = useContext(RadioContext)
  if (context === undefined) {
    throw new Error(`${componentName} must be used inside RadioGroup.`)
  }
  return context
}

export function RadioGroup(props: RadioGroupProps) {
  const [local, rest] = splitProps(props, [
    'value',
    'defaultValue',
    'disabled',
    'orientation',
    'class',
    'children',
    'onValueChange',
  ])
  const controller = createSelectionController({
    get value() {
      return local.value
    },
    get defaultValue() {
      return local.defaultValue
    },
    get multiple() {
      return false
    },
    onChange(values, meta) {
      const nextValue = values[0]
      if (nextValue === undefined) return
      local.onValueChange?.(nextValue, toRadioChangeMeta(nextValue, meta))
    },
  })
  const snapshot = createCoreStoreSignal(controller)
  const currentValue = () => local.value ?? snapshot().value
  const orientation = () => local.orientation ?? 'vertical'

  return (
    <RadioContext.Provider
      value={{
        value: currentValue,
        disabled: () => local.disabled === true,
        select: (nextValue) => controller.replace(nextValue),
      }}
    >
      <div
        {...rest}
        role="radiogroup"
        data-orientation={orientation()}
        data-disabled={local.disabled ? 'true' : undefined}
        class={cn(radioGroupClassName({ orientation: orientation() }), local.class)}
      >
        {local.children}
      </div>
    </RadioContext.Provider>
  )
}

export function Radio(props: RadioProps) {
  const context = useRadioContext('Radio')
  const [local, rest] = splitProps(props, ['value', 'disabled', 'size', 'class', 'children', 'onClick'])
  const checked = () => context.value() === local.value
  const currentDisabled = () => context.disabled() || local.disabled === true
  const size = () => local.size ?? 'default'

  return (
    <button
      {...rest}
      type="button"
      role="radio"
      disabled={currentDisabled()}
      aria-checked={checked()}
      data-state={checked() ? 'checked' : 'unchecked'}
      data-disabled={currentDisabled() ? 'true' : undefined}
      data-value={local.value}
      class={cn(radioRootClassName({ size: size() }), local.class)}
      onClick={(event) => {
        if (typeof local.onClick === 'function') {
          local.onClick(event)
        }
        if (event.defaultPrevented || currentDisabled()) return
        context.select(local.value)
      }}
    >
      {checked() ? <span class={radioIndicatorClassName({ size: size() })} /> : null}
      {local.children}
    </button>
  )
}

export function RadioButton(props: RadioButtonProps) {
  const context = useRadioContext('RadioButton')
  const [local, rest] = splitProps(props, ['value', 'disabled', 'size', 'class', 'children', 'onClick'])
  const checked = () => context.value() === local.value
  const currentDisabled = () => context.disabled() || local.disabled === true
  const size = () => local.size ?? 'default'

  return (
    <button
      {...rest}
      type="button"
      role="radio"
      disabled={currentDisabled()}
      aria-checked={checked()}
      data-state={checked() ? 'checked' : 'unchecked'}
      data-disabled={currentDisabled() ? 'true' : undefined}
      data-value={local.value}
      class={cn(radioButtonClassName({ size: size() }), local.class)}
      onClick={(event) => {
        if (typeof local.onClick === 'function') {
          local.onClick(event)
        }
        if (event.defaultPrevented || currentDisabled()) return
        context.select(local.value)
      }}
    >
      {local.children}
    </button>
  )
}
