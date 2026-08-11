import { createInputOTPController } from '@fex-design/core/input-otp/create-input-otp-controller'
import type {
  InputOTPAccept,
  InputOTPChangeMeta,
  InputOTPCompleteMeta,
  InputOTPRootOptions,
  InputOTPTransform,
  InputOTPValue,
} from '@fex-design/core/input-otp/types'
import {
  inputOTPGroupClassName,
  inputOTPInputClassName,
  inputOTPRootClassName,
  inputOTPSeparatorClassName,
} from '@fex-design/styles/input-otp'
import { cn } from '@fex/utils'
import {
  useRef,
  type ComponentProps,
  type HTMLAttributes,
  type KeyboardEvent,
  type Ref,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useLazyRef } from '../../hooks/use-lazy-ref'
import { InputOTPContext, useInputOTPContext } from './input-otp-context'

export interface InputOTPRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
    InputOTPRootOptions {
  ref?: Ref<HTMLDivElement> | undefined
}

export function InputOTPRoot({
  value,
  defaultValue,
  disabled = false,
  readOnly = false,
  invalid = false,
  isComplete,
  onChange,
  onComplete,
  className,
  ref,
  children,
  ...props
}: InputOTPRootProps) {
  const optionsRef = useRef<InputOTPRootOptions>({})
  Object.assign(optionsRef.current, {
    value,
    defaultValue,
    disabled,
    readOnly,
    invalid,
    isComplete,
    onChange,
    onComplete,
  })
  const controller = useLazyRef(() =>
    createInputOTPController({
      get value() {
        return optionsRef.current.value
      },
      get defaultValue() {
        return optionsRef.current.defaultValue
      },
      get disabled() {
        return optionsRef.current.disabled
      },
      get readOnly() {
        return optionsRef.current.readOnly
      },
      get invalid() {
        return optionsRef.current.invalid
      },
      get isComplete() {
        return optionsRef.current.isComplete
      },
      onChange(nextValue: InputOTPValue, meta: InputOTPChangeMeta) {
        optionsRef.current.onChange?.(nextValue, meta)
      },
      onComplete(nextValue: InputOTPValue, meta: InputOTPCompleteMeta) {
        optionsRef.current.onComplete?.(nextValue, meta)
      },
    }),
  ).current
  const snapshot = useCoreStore(controller)
  const inputsRef = useRef(new Map<number, HTMLInputElement>())

  // Controlled props are synchronized after commit to avoid mutating an external store during render.
  useIsomorphicLayoutEffect(() => {
    controller.setOptions(optionsRef.current)
  }, [value, defaultValue, disabled, readOnly, invalid, isComplete, onChange, onComplete])

  const registerInput = (index: number, element: HTMLInputElement | null) => {
    if (element) inputsRef.current.set(index, element)
    else inputsRef.current.delete(index)
  }
  const focusInput = (index: number, cursor: 'start' | 'end' | 'all' = 'all') => {
    const input = inputsRef.current.get(index)
    if (!input || input.disabled) return
    input.focus()
    const position = cursor === 'start' ? 0 : input.value.length
    input.setSelectionRange(cursor === 'all' ? 0 : position, position)
  }

  return (
    <InputOTPContext value={{ controller, snapshot, registerInput, focusInput }}>
      <div
        {...props}
        ref={ref}
        role={props.role ?? 'group'}
        data-slot="input-otp-root"
        data-disabled={disabled ? 'true' : undefined}
        data-readonly={readOnly ? 'true' : undefined}
        data-invalid={invalid ? 'true' : undefined}
        data-complete={snapshot.complete ? 'true' : undefined}
        className={cn(inputOTPRootClassName, className)}
      >
        {children}
      </div>
    </InputOTPContext>
  )
}

export interface InputOTPInputProps
  extends Omit<ComponentProps<'input'>, 'defaultValue' | 'disabled' | 'onChange' | 'readOnly' | 'value'> {
  index: number
  maxLength?: number | undefined
  autoAdvance?: boolean | undefined
  transform?: InputOTPTransform | undefined
  accept?: InputOTPAccept | undefined
  onChange?: ComponentProps<'input'>['onChange']
  ref?: Ref<HTMLInputElement> | undefined
}

export function InputOTPInput({
  index,
  maxLength,
  autoAdvance = true,
  transform,
  accept,
  disabled = false,
  readOnly = false,
  className,
  onChange,
  onPaste,
  onKeyDown,
  ref,
  ...props
}: InputOTPInputProps) {
  const context = useInputOTPContext('InputOTPInput')
  const segment = context.snapshot.segments.find((item) => item.index === index)
  const currentValue = context.snapshot.value[index] ?? ''
  const currentDisabled = context.snapshot.disabled || disabled
  const currentReadOnly = context.snapshot.readOnly || readOnly
  const segmentConfig = { index, maxLength, autoAdvance, transform, accept, disabled, readOnly }

  // Segment registration synchronizes the rendered input tree with the framework-neutral controller.
  useIsomorphicLayoutEffect(() => context.controller.registerSegment(segmentConfig), [index])
  useIsomorphicLayoutEffect(() => {
    context.controller.updateSegment(segmentConfig)
  }, [index, maxLength, autoAdvance, transform, accept, disabled, readOnly])

  const setRefs = (element: HTMLInputElement | null) => {
    context.registerInput(index, element)
    if (typeof ref === 'function') ref(element)
    else if (ref) ref.current = element
  }

  const applyText = (
    text: string,
    reason: 'input' | 'paste' | 'autofill' | 'delete' | 'composition',
    selection = { start: 0, end: currentValue.length },
  ) => {
    const result = context.controller.applyInput({ index, text, selection, reason })
    if (result.focusIndex !== undefined) context.focusInput(result.focusIndex, result.cursor)
    return result
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    onKeyDown?.(event)
    if (event.defaultPrevented) return
    const input = event.currentTarget
    const start = input.selectionStart ?? 0
    const end = input.selectionEnd ?? start
    if (event.key === 'Backspace' && currentValue === '' && start === 0 && end === 0) {
      event.preventDefault()
      context.focusInput(index - 1, 'end')
    } else if (event.key === 'ArrowLeft' && start === 0 && end === 0) {
      event.preventDefault()
      context.focusInput(index - 1, 'end')
    } else if (event.key === 'ArrowRight' && start === currentValue.length && end === start) {
      event.preventDefault()
      context.focusInput(index + 1, 'start')
    }
  }

  return (
    <input
      {...props}
      ref={setRefs}
      type={props.type ?? 'text'}
      value={currentValue}
      disabled={currentDisabled}
      readOnly={currentReadOnly}
      aria-invalid={props['aria-invalid'] ?? (context.snapshot.invalid || undefined)}
      data-slot="input-otp-input"
      data-index={index}
      data-filled={currentValue.length > 0 ? 'true' : undefined}
      data-complete={segment?.complete ? 'true' : undefined}
      className={cn(inputOTPInputClassName, className)}
      onChange={(event) => {
        onChange?.(event)
        if (event.defaultPrevented) return
        const result = applyText(
          event.currentTarget.value,
          event.nativeEvent instanceof InputEvent && event.nativeEvent.inputType.startsWith('delete')
            ? 'delete'
            : 'input',
        )
        if (!result.accepted) event.currentTarget.value = currentValue
      }}
      onPaste={(event) => {
        onPaste?.(event)
        if (event.defaultPrevented || currentDisabled || currentReadOnly) return
        event.preventDefault()
        applyText(event.clipboardData.getData('text'), 'paste', {
          start: event.currentTarget.selectionStart ?? 0,
          end: event.currentTarget.selectionEnd ?? 0,
        })
      }}
      onKeyDown={handleKeyDown}
    />
  )
}

export function InputOTPGroup({ className, ...props }: ComponentProps<'div'>) {
  return <div {...props} data-slot="input-otp-group" className={cn(inputOTPGroupClassName, className)} />
}

export function InputOTPSeparator({
  className,
  children = '–',
  ...props
}: ComponentProps<'span'>) {
  return (
    <span
      {...props}
      aria-hidden={props['aria-hidden'] ?? true}
      data-slot="input-otp-separator"
      className={cn(inputOTPSeparatorClassName, className)}
    >
      {children}
    </span>
  )
}
