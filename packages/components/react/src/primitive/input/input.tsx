import {
  inputAddonAfterClassName,
  inputAddonBeforeClassName,
  inputClearClassName,
  inputControlClassName,
  inputPrefixClassName,
  inputRootClassName,
  inputSuffixClassName,
} from '@fex/components-styles/input'
import { cn } from '@fex/utils'
import {
  type ChangeEvent,
  type ComponentProps,
  type HTMLAttributes,
  type MouseEvent,
  type PointerEvent,
  type ReactNode,
  type Ref,
} from 'react'
import { CloseIcon } from '../../icon/close'
import { useComposedRef } from '../../hooks/use-composed-ref'
import { Button } from '../button/button'
import { InputContext, useInputContext } from './input-context'
import { useInput, type UseInputOptions } from './use-input'

export interface InputRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>, UseInputOptions {
  invalid?: boolean
  ref?: Ref<HTMLDivElement> | undefined
}

export function InputRoot({
  value,
  defaultValue,
  disabled,
  readOnly,
  invalid = false,
  'aria-invalid': ariaInvalid,
  onValueChange,
  onClear,
  className,
  ref,
  children,
  ...props
}: InputRootProps) {
  const resolvedInvalid = invalid || ariaInvalid === true || ariaInvalid === 'true'
  const input = useInput({
    value,
    defaultValue,
    disabled,
    readOnly,
    invalid: resolvedInvalid,
    onValueChange,
    onClear,
  })

  return (
    <InputContext value={input}>
      <div
        {...props}
        ref={ref}
        data-slot="input-root"
        data-disabled={input.disabled ? 'true' : undefined}
        data-readonly={input.readOnly ? 'true' : undefined}
        data-invalid={input.invalid ? 'true' : undefined}
        className={cn(inputRootClassName, className)}
      >
        {children}
      </div>
    </InputContext>
  )
}

export interface InputControlProps extends ComponentProps<'input'> {
  ref?: Ref<HTMLInputElement> | undefined
}

export function InputControl({
  className,
  disabled,
  readOnly,
  'aria-invalid': ariaInvalid,
  onChange,
  ref,
  ...props
}: InputControlProps) {
  const context = useInputContext('InputControl')
  const composedRef = useComposedRef(ref, context.focusRef)

  return (
    <input
      {...props}
      ref={composedRef}
      value={context.value}
      disabled={context.disabled || disabled}
      readOnly={context.readOnly || readOnly}
      aria-invalid={ariaInvalid ?? (context.invalid || undefined)}
      data-slot="input-control"
      className={cn(inputControlClassName, className)}
      onChange={(event: ChangeEvent<HTMLInputElement>) => {
        onChange?.(event)
        if (!event.defaultPrevented) {
          context.setValue(event.currentTarget.value, { reason: 'input', event })
        }
      }}
    />
  )
}

export interface InputPrefixProps extends ComponentProps<'span'> {
  ref?: Ref<HTMLSpanElement> | undefined
}

export function InputPrefix({ className, ref, ...props }: InputPrefixProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="input-prefix"
      className={cn(inputPrefixClassName, className)}
    />
  )
}

export interface InputSuffixProps extends ComponentProps<'span'> {
  ref?: Ref<HTMLSpanElement> | undefined
}

export function InputSuffix({ className, ref, ...props }: InputSuffixProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="input-suffix"
      className={cn(inputSuffixClassName, className)}
    />
  )
}

export interface InputAddonBeforeProps extends ComponentProps<'span'> {
  ref?: Ref<HTMLSpanElement> | undefined
}

export function InputAddonBefore({ className, ref, ...props }: InputAddonBeforeProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="input-addon-before"
      className={cn(inputAddonBeforeClassName, className)}
    />
  )
}

export interface InputAddonAfterProps extends ComponentProps<'span'> {
  ref?: Ref<HTMLSpanElement> | undefined
}

export function InputAddonAfter({ className, ref, ...props }: InputAddonAfterProps) {
  return (
    <span
      {...props}
      ref={ref}
      data-slot="input-addon-after"
      className={cn(inputAddonAfterClassName, className)}
    />
  )
}

export interface InputClearProps extends Omit<ComponentProps<'button'>, 'type'> {
  forceMount?: boolean
  ref?: Ref<HTMLButtonElement> | undefined
  children?: ReactNode
}

export function InputClear({
  forceMount = false,
  className,
  children,
  'aria-label': ariaLabel = 'Clear input',
  onPointerDown,
  onClick,
  ref,
  ...props
}: InputClearProps) {
  const input = useInputContext('InputClear')
  if (!forceMount && !input.canClear) return null

  return (
    <Button
      {...props}
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      data-slot="input-clear"
      data-visible={input.canClear ? 'true' : 'false'}
      disabled={!input.canClear}
      className={cn(inputClearClassName, className)}
      onPointerDown={(event: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(event)
        if (!event.defaultPrevented) event.preventDefault()
      }}
      onClick={(event: MouseEvent<HTMLButtonElement>) => {
        onClick?.(event)
        if (!event.defaultPrevented) input.clear()
      }}
    >
      {children ?? <CloseIcon />}
    </Button>
  )
}
