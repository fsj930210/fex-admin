import {
  syncTextareaAutoSize,
  type TextareaAutoSize,
} from '@fex-design/core/textarea/autosize'
import {
  textareaClearClassName,
  textareaFooterClassName,
  textareaInputClassName,
  textareaRootClassName,
} from '@fex-design/styles/textarea'
import { cn } from '@fex/utils'
import {
  createContext,
  createEffect,
  createMemo,
  createSignal,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { Show } from 'solid-js'
import { CloseIcon } from '../../icon/close'
import { Button } from '../button/button'

export type TextareaChangeReason = 'input' | 'clear'

export interface CreateTextareaOptions {
  value?: Accessor<string | undefined>
  defaultValue?: string | undefined
  disabled?: Accessor<boolean | undefined>
  readOnly?: Accessor<boolean | undefined>
  invalid?: Accessor<boolean | undefined>
  autoSize?: Accessor<TextareaAutoSize | undefined>
  onChange?:
    | ((value: string, meta: { reason: TextareaChangeReason; event?: InputEvent }) => void)
    | undefined
  onClear?: (() => void) | undefined
}

export function createTextarea(options: CreateTextareaOptions = {}) {
  const [internalValue, setInternalValue] = createSignal(options.defaultValue ?? '')
  let focusElement: HTMLTextAreaElement | undefined
  const value = createMemo(() => options.value?.() ?? internalValue())
  const disabled = createMemo(() => options.disabled?.() ?? false)
  const readOnly = createMemo(() => options.readOnly?.() ?? false)
  const invalid = createMemo(() => options.invalid?.() ?? false)
  const autoSize = createMemo(() => options.autoSize?.())
  const canClear = createMemo(() => value() !== '' && !disabled() && !readOnly())

  function syncAutoSize() {
    if (focusElement) syncTextareaAutoSize(focusElement, autoSize())
  }
  function setValue(nextValue: string, reason: TextareaChangeReason, event?: InputEvent) {
    if (disabled() || readOnly()) return
    if (options.value?.() === undefined) setInternalValue(nextValue)
    options.onChange?.(nextValue, { reason, ...(event === undefined ? {} : { event }) })
  }
  function clear() {
    if (!canClear()) return
    setValue('', 'clear')
    options.onClear?.()
    focusElement?.focus()
  }

  return {
    value,
    disabled,
    readOnly,
    invalid,
    autoSize,
    canClear,
    setValue,
    clear,
    focus: () => focusElement?.focus(),
    setFocusElement: (element: HTMLTextAreaElement) => {
      focusElement = element
      syncAutoSize()
    },
    syncAutoSize,
  }
}

export const useTextarea = createTextarea

type TextareaContextValue = ReturnType<typeof createTextarea>
const TextareaContext = createContext<TextareaContextValue>()

function useTextareaContext(name: string) {
  const context = useContext(TextareaContext)
  if (!context) throw new Error(`${name} must be used inside TextareaRoot.`)
  return context
}

export interface TextareaRootProps
  extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>> {
  value?: string | undefined
  defaultValue?: string | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  status?: 'error' | 'warning' | undefined
  autoSize?: TextareaAutoSize | undefined
  allowClear?: boolean | undefined
  onChange?:
    | ((value: string, meta: { reason: TextareaChangeReason; event?: InputEvent }) => void)
    | undefined
  onClear?: (() => void) | undefined
}

export function TextareaRoot(props: TextareaRootProps) {
  const [local, rest] = splitProps(props, [
    'children',
    'class',
    'value',
    'defaultValue',
    'disabled',
    'readOnly',
    'invalid',
    'status',
    'autoSize',
    'allowClear',
    'onChange',
    'onClear',
  ])
  const textarea = createTextarea({
    value: () => props.value,
    defaultValue: props.defaultValue,
    disabled: () => props.disabled,
    readOnly: () => props.readOnly,
    invalid: () => props.invalid || props.status === 'error',
    autoSize: () => props.autoSize,
    onChange: (value, meta) => props.onChange?.(value, meta),
    onClear: () => props.onClear?.(),
  })

  return (
    <TextareaContext.Provider value={textarea}>
      <div
        {...rest}
        data-slot="textarea-root"
        data-disabled={textarea.disabled() || undefined}
        data-readonly={textarea.readOnly() || undefined}
        data-invalid={textarea.invalid() || undefined}
        data-status={local.status}
        class={cn(textareaRootClassName, local.class)}
      >
        {local.children}
        <Show when={local.allowClear}>
          <TextareaClear />
        </Show>
      </div>
    </TextareaContext.Provider>
  )
}

export function TextareaInput(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const context = useTextareaContext('TextareaInput')
  const [local, rest] = splitProps(props, [
    'class',
    'onInput',
    'ref',
    'disabled',
    'readOnly',
    'aria-invalid',
  ])
  let element: HTMLTextAreaElement | undefined

  createEffect(() => {
    context.value()
    context.autoSize()
    context.syncAutoSize()
  })
  createEffect(() => {
    if (!element || !context.autoSize() || typeof ResizeObserver === 'undefined') return
    const observer = new ResizeObserver(() => context.syncAutoSize())
    observer.observe(element)
    onCleanup(() => observer.disconnect())
  })

  return (
    <textarea
      {...rest}
      ref={(node) => {
        element = node
        context.setFocusElement(node)
        if (typeof local.ref === 'function') local.ref(node)
      }}
      value={context.value()}
      disabled={context.disabled() || local.disabled}
      readOnly={context.readOnly() || local.readOnly}
      aria-invalid={local['aria-invalid'] ?? (context.invalid() || undefined)}
      data-slot="textarea-input"
      class={cn(textareaInputClassName, local.class)}
      onInput={(event) => {
        if (typeof local.onInput === 'function') local.onInput(event)
        if (!event.defaultPrevented) {
          context.setValue(event.currentTarget.value, 'input', event)
        }
      }}
    />
  )
}

export function TextareaFooter(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return (
    <div {...props} data-slot="textarea-footer" class={cn(textareaFooterClassName, props.class)}>
      {props.children}
    </div>
  )
}

export function TextareaClear(
  props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>> & { forceMount?: boolean },
) {
  const context = useTextareaContext('TextareaClear')
  const [local, rest] = splitProps(props, [
    'forceMount',
    'class',
    'children',
    'onPointerDown',
    'onClick',
  ])
  return (
    <Show when={local.forceMount || context.canClear()}>
      <Button
        {...rest}
        type="button"
        aria-label={rest['aria-label'] ?? 'Clear textarea'}
        data-slot="textarea-clear"
        disabled={!local.forceMount && !context.canClear()}
        class={cn(textareaClearClassName, local.class)}
        onPointerDown={(event) => {
          if (typeof local.onPointerDown === 'function') local.onPointerDown(event)
          if (!event.defaultPrevented) event.preventDefault()
        }}
        onClick={(event) => {
          if (typeof local.onClick === 'function') local.onClick(event)
          if (!event.defaultPrevented) context.clear()
        }}
      >
        {local.children ?? <CloseIcon />}
      </Button>
    </Show>
  )
}
