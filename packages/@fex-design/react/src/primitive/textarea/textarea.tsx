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
  use,
  useRef,
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
import { useControllableState } from '../../hooks/use-controllable-state'
import { useIsomorphicLayoutEffect } from '../../hooks/use-isomorphic-layout-effect'
import { useMemoizedFn } from '../../hooks/use-memoized-fn'
import { Button } from '../button/button'

export type TextareaChangeReason = 'input' | 'clear'

export interface TextareaChangeMeta {
  reason: TextareaChangeReason
  event?: ChangeEvent<HTMLTextAreaElement> | undefined
}

export interface UseTextareaOptions {
  value?: string | undefined
  defaultValue?: string | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  autoSize?: TextareaAutoSize | undefined
  onChange?: ((value: string, meta: TextareaChangeMeta) => void) | undefined
  onClear?: ((meta: TextareaChangeMeta) => void) | undefined
}

export interface TextareaController {
  value: string
  disabled: boolean
  readOnly: boolean
  invalid: boolean
  canClear: boolean
  autoSize?: TextareaAutoSize | undefined
  focusRef: (element: HTMLTextAreaElement | null) => void
  setValue: (value: string, meta: TextareaChangeMeta) => void
  clear: () => void
  focus: () => void
  syncAutoSize: () => void
}

export function useTextarea({
  value,
  defaultValue = '',
  disabled = false,
  readOnly = false,
  invalid = false,
  autoSize,
  onChange,
  onClear,
}: UseTextareaOptions = {}): TextareaController {
  const elementRef = useRef<HTMLTextAreaElement | null>(null)
  const handleChange = useMemoizedFn((nextValue: string, meta?: TextareaChangeMeta) => {
    onChange?.(nextValue, meta ?? { reason: 'input' })
  })
  const [currentValue, setCurrentValue] = useControllableState<string>(
    { value, defaultValue, onChange: handleChange },
    { trigger: 'onChange' },
  )

  const syncAutoSize = useMemoizedFn(() => {
    if (elementRef.current) syncTextareaAutoSize(elementRef.current, autoSize)
  })

  const focusRef = useMemoizedFn((element: HTMLTextAreaElement | null) => {
    elementRef.current = element
    syncAutoSize()
  })

  const focus = useMemoizedFn(() => {
    elementRef.current?.focus()
  })

  const setValue = useMemoizedFn((nextValue: string, meta: TextareaChangeMeta) => {
    if (disabled || readOnly) return
    setCurrentValue(nextValue, meta)
  })

  const clear = useMemoizedFn(() => {
    if (currentValue === '' || disabled || readOnly) return
    const meta: TextareaChangeMeta = { reason: 'clear' }
    setCurrentValue('', meta)
    onClear?.(meta)
    focus()
  })

  return {
    value: currentValue,
    disabled,
    readOnly,
    invalid,
    canClear: currentValue !== '' && !disabled && !readOnly,
    autoSize,
    focusRef,
    setValue,
    clear,
    focus,
    syncAutoSize,
  }
}

const TextareaContext = createContext<TextareaController | null>(null)

function useTextareaContext(component: string) {
  const context = use(TextareaContext)
  if (!context) throw new Error(`${component} must be used inside TextareaRoot.`)
  return context
}

export type TextareaClearRenderProps = Omit<ComponentProps<'button'>, 'ref' | 'children'> & {
  'data-slot': 'textarea-clear'
}

export interface TextareaRootProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue' | 'onChange'>,
    UseTextareaOptions {
  status?: 'error' | 'warning' | undefined
  allowClear?: boolean | ((props: TextareaClearRenderProps) => ReactNode) | undefined
  ref?: Ref<HTMLDivElement> | undefined
}

export function TextareaRoot({
  value,
  defaultValue,
  disabled,
  readOnly,
  invalid = false,
  status,
  autoSize,
  onChange,
  onClear,
  allowClear,
  className,
  children,
  ref,
  ...props
}: TextareaRootProps) {
  const resolvedInvalid = invalid || status === 'error'
  const textarea = useTextarea({
    value,
    defaultValue,
    disabled,
    readOnly,
    invalid: resolvedInvalid,
    autoSize,
    onChange,
    onClear,
  })

  return (
    <TextareaContext value={textarea}>
      <div
        {...props}
        ref={ref}
        data-slot="textarea-root"
        data-disabled={textarea.disabled ? 'true' : undefined}
        data-readonly={textarea.readOnly ? 'true' : undefined}
        data-invalid={textarea.invalid ? 'true' : undefined}
        data-status={status}
        className={cn(textareaRootClassName, className)}
      >
        {children}
        {allowClear ? <TextareaClear>{typeof allowClear === 'function' ? allowClear : undefined}</TextareaClear> : null}
      </div>
    </TextareaContext>
  )
}

export interface TextareaInputProps extends Omit<ComponentProps<'textarea'>, 'value'> {
  ref?: Ref<HTMLTextAreaElement> | undefined
}

export function TextareaInput({
  className,
  disabled,
  readOnly,
  'aria-invalid': ariaInvalid,
  onChange,
  ref,
  ...props
}: TextareaInputProps) {
  const context = useTextareaContext('TextareaInput')
  const elementRef = useRef<HTMLTextAreaElement | null>(null)
  const setElementRef = useMemoizedFn((element: HTMLTextAreaElement | null) => {
    elementRef.current = element
  })
  const composedRef = useComposedRef(ref, setElementRef, context.focusRef)

  useIsomorphicLayoutEffect(() => {
    context.syncAutoSize()
  }, [context.value, context.autoSize, context.syncAutoSize])

  useIsomorphicLayoutEffect(() => {
    if (!context.autoSize || typeof ResizeObserver === 'undefined') return
    const element = elementRef.current
    if (!element) return
    const observer = new ResizeObserver(() => context.syncAutoSize())
    observer.observe(element)
    return () => observer.disconnect()
  }, [context.autoSize, context.syncAutoSize])

  return (
    <textarea
      {...props}
      ref={composedRef}
      value={context.value}
      disabled={context.disabled || disabled}
      readOnly={context.readOnly || readOnly}
      aria-invalid={ariaInvalid ?? (context.invalid || undefined)}
      data-slot="textarea-input"
      className={cn(textareaInputClassName, className)}
      onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
        onChange?.(event)
        if (!event.defaultPrevented) {
          context.setValue(event.currentTarget.value, { reason: 'input', event })
        }
      }}
    />
  )
}

export interface TextareaFooterProps extends ComponentProps<'div'> {
  ref?: Ref<HTMLDivElement> | undefined
}

export function TextareaFooter({ className, ref, ...props }: TextareaFooterProps) {
  return (
    <div
      {...props}
      ref={ref}
      data-slot="textarea-footer"
      className={cn(textareaFooterClassName, className)}
    />
  )
}

export interface TextareaClearProps extends Omit<ComponentProps<'button'>, 'type' | 'children'> {
  forceMount?: boolean | undefined
  ref?: Ref<HTMLButtonElement> | undefined
  children?: ReactNode | ((props: TextareaClearRenderProps) => ReactNode)
}

export function TextareaClear({
  forceMount = false,
  className,
  children,
  'aria-label': ariaLabel = 'Clear textarea',
  onPointerDown,
  onClick,
  ref,
  ...props
}: TextareaClearProps) {
  const textarea = useTextareaContext('TextareaClear')
  if (!forceMount && !textarea.canClear) return null

  const clearProps = {
    ...props,
    ...(ref ? { ref } : {}),
    type: 'button' as const,
    'aria-label': ariaLabel,
    'data-slot': 'textarea-clear',
    disabled: !forceMount && !textarea.canClear,
    className: cn(textareaClearClassName, className),
    onPointerDown: (event: PointerEvent<HTMLButtonElement>) => {
      onPointerDown?.(event)
      if (!event.defaultPrevented) event.preventDefault()
    },
    onClick: (event: MouseEvent<HTMLButtonElement>) => {
      onClick?.(event)
      if (!event.defaultPrevented) textarea.clear()
    },
  } satisfies TextareaClearRenderProps & { ref?: Ref<HTMLButtonElement> }

  if (typeof children === 'function') return children(clearProps)

  return <Button {...clearProps}>{children ?? <CloseIcon />}</Button>
}
