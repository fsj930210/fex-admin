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
  createEffect,
  onCleanup,
  onMount,
  splitProps,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { InputOTPContext, useInputOTPContext } from './input-otp-context'

export interface InputOTPRootProps
  extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>>,
    Omit<InputOTPRootOptions, 'onChange' | 'onComplete'> {
  onChange?: (value: InputOTPValue, meta: InputOTPChangeMeta) => void
  onComplete?: (value: InputOTPValue, meta: InputOTPCompleteMeta) => void
}

export function InputOTPRoot(props: InputOTPRootProps) {
  const [local, rest] = splitProps(props, [
    'value', 'defaultValue', 'disabled', 'readOnly', 'invalid', 'isComplete',
    'onChange', 'onComplete', 'class', 'children',
  ])
  const controller = createInputOTPController()
  const snapshot = createCoreStoreSignal(controller)
  const inputs = new Map<number, HTMLInputElement>()

  // Controlled props are an external reactive boundary for the framework-neutral controller.
  createEffect(() => {
    controller.setOptions({
      value: local.value,
      defaultValue: local.defaultValue,
      disabled: local.disabled,
      readOnly: local.readOnly,
      invalid: local.invalid,
      isComplete: local.isComplete,
      onChange: local.onChange,
      onComplete: local.onComplete,
    })
  })

  const registerInput = (index: number, element: HTMLInputElement | null) => {
    if (element) inputs.set(index, element)
    else inputs.delete(index)
  }
  const focusInput = (index: number, cursor: 'start' | 'end' | 'all' = 'all') => {
    const input = inputs.get(index)
    if (!input || input.disabled) return
    input.focus()
    const position = cursor === 'start' ? 0 : input.value.length
    input.setSelectionRange(cursor === 'all' ? 0 : position, position)
  }

  return (
    <InputOTPContext.Provider value={{ controller, snapshot, registerInput, focusInput }}>
      <div
        {...rest}
        role={rest.role ?? 'group'}
        data-slot="input-otp-root"
        data-disabled={local.disabled ? 'true' : undefined}
        data-readonly={local.readOnly ? 'true' : undefined}
        data-invalid={local.invalid ? 'true' : undefined}
        data-complete={snapshot().complete ? 'true' : undefined}
        class={cn(inputOTPRootClassName, local.class)}
      >
        {local.children}
      </div>
    </InputOTPContext.Provider>
  )
}

export interface InputOTPInputProps
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  index: number
  maxLength?: number
  autoAdvance?: boolean
  transform?: InputOTPTransform
  accept?: InputOTPAccept
  onChange?: JSX.EventHandler<HTMLInputElement, Event>
}

export function InputOTPInput(props: InputOTPInputProps) {
  const context = useInputOTPContext('InputOTPInput')
  const [local, rest] = splitProps(props, [
    'index', 'maxLength', 'autoAdvance', 'transform', 'accept', 'disabled', 'readOnly',
    'class', 'ref', 'onChange', 'onPaste', 'onKeyDown',
  ])
  const config = () => ({
    index: local.index,
    maxLength: local.maxLength,
    autoAdvance: local.autoAdvance ?? true,
    transform: local.transform,
    accept: local.accept,
    disabled: local.disabled === true,
    readOnly: local.readOnly === true,
  })
  let element: HTMLInputElement | undefined
  let unregister: (() => void) | undefined

  onMount(() => {
    unregister = context.controller.registerSegment(config())
    if (element) context.registerInput(local.index, element)
  })
  onCleanup(() => {
    unregister?.()
    context.registerInput(local.index, null)
  })
  // Segment props must stay synchronized with the registered core segment.
  createEffect(() => context.controller.updateSegment(config()))

  const currentValue = () => context.snapshot().value[local.index] ?? ''
  const currentDisabled = () => context.snapshot().disabled || local.disabled === true
  const currentReadOnly = () => context.snapshot().readOnly || local.readOnly === true
  const segment = () => context.snapshot().segments.find((item) => item.index === local.index)
  const applyText = (
    text: string,
    reason: 'input' | 'paste' | 'delete' | 'composition',
    selection = { start: 0, end: currentValue().length },
  ) => {
    const result = context.controller.applyInput({ index: local.index, text, selection, reason })
    if (result.focusIndex !== undefined) context.focusInput(result.focusIndex, result.cursor)
    return result
  }

  return (
    <input
      {...rest}
      ref={(node) => {
        element = node
        context.registerInput(local.index, node)
        if (typeof local.ref === 'function') local.ref(node)
      }}
      type={rest.type ?? 'text'}
      value={currentValue()}
      disabled={currentDisabled()}
      readOnly={currentReadOnly()}
      aria-invalid={rest['aria-invalid'] ?? (context.snapshot().invalid || undefined)}
      data-slot="input-otp-input"
      data-index={local.index}
      data-filled={currentValue().length > 0 ? 'true' : undefined}
      data-complete={segment()?.complete ? 'true' : undefined}
      class={cn(inputOTPInputClassName, local.class)}
      onInput={(event) => {
        const handler = local.onChange
        if (typeof handler === 'function') handler(event)
        if (event.defaultPrevented) return
        const native = event as InputEvent
        const result = applyText(event.currentTarget.value, native.inputType?.startsWith('delete') ? 'delete' : 'input')
        if (!result.accepted) event.currentTarget.value = currentValue()
      }}
      onPaste={(event) => {
        if (typeof local.onPaste === 'function') local.onPaste(event)
        if (event.defaultPrevented || currentDisabled() || currentReadOnly()) return
        event.preventDefault()
        applyText(event.clipboardData?.getData('text') ?? '', 'paste', {
          start: event.currentTarget.selectionStart ?? 0,
          end: event.currentTarget.selectionEnd ?? 0,
        })
      }}
      onKeyDown={(event) => {
        if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
        if (event.defaultPrevented) return
        const start = event.currentTarget.selectionStart ?? 0
        const end = event.currentTarget.selectionEnd ?? start
        if (event.key === 'Backspace' && currentValue() === '' && start === 0 && end === 0) {
          event.preventDefault(); context.focusInput(local.index - 1, 'end')
        } else if (event.key === 'ArrowLeft' && start === 0 && end === 0) {
          event.preventDefault(); context.focusInput(local.index - 1, 'end')
        } else if (event.key === 'ArrowRight' && start === currentValue().length && end === start) {
          event.preventDefault(); context.focusInput(local.index + 1, 'start')
        }
      }}
    />
  )
}

export function InputOTPGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div {...rest} data-slot="input-otp-group" class={cn(inputOTPGroupClassName, local.class)}>{local.children}</div>
}

export function InputOTPSeparator(props: ParentProps<JSX.HTMLAttributes<HTMLSpanElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <span {...rest} aria-hidden="true" data-slot="input-otp-separator" class={cn(inputOTPSeparatorClassName, local.class)}>{local.children ?? '–'}</span>
}
