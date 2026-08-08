import { type ComponentProps, type KeyboardEvent, type ReactNode, type Ref, useRef } from 'react'
import { TextareaInput, TextareaRoot, type TextareaRootProps } from '../textarea/textarea'
import { useMentionsContext } from './mentions-context'
import { useMentions } from './use-mentions'

function getSelection(element: HTMLTextAreaElement | HTMLInputElement | null) {
  return { start: element?.selectionStart ?? 0, end: element?.selectionEnd ?? 0 }
}

export interface MentionsTriggerRenderProps {
  props: ComponentProps<'textarea'>
  ref: Ref<HTMLTextAreaElement>
  state: ReturnType<typeof useMentions>
}

export interface MentionsTriggerProps
  extends Omit<ComponentProps<'textarea'>, 'children' | 'defaultValue' | 'value'> {
  children?: ((state: MentionsTriggerRenderProps) => ReactNode) | undefined
  rootClassName?: string | undefined
  autoSize?: TextareaRootProps['autoSize']
}

export function MentionsTrigger({
  children,
  rootClassName,
  autoSize,
  onChange,
  onKeyDown,
  onClick,
  onSelect,
  onFocus,
  onBlur,
  ref,
  ...props
}: MentionsTriggerProps) {
  const context = useMentions()
  const rootContext = useMentionsContext('MentionsTrigger')
  const composing = useRef(false)
  const elementRef = useRef<HTMLTextAreaElement | null>(null)
  const setElementRef = (element: HTMLTextAreaElement | null) => {
    elementRef.current = element
    rootContext.setTriggerElement(element)
    if (typeof ref === 'function') ref(element)
  }
  const syncSelection = (reason: 'selection' | 'input' = 'selection') => {
    const selection = getSelection(elementRef.current)
    if (reason === 'input') rootContext.controller.setValue(elementRef.current?.value ?? '', selection)
    else rootContext.controller.setSelection(selection)
  }
  const inputProps: ComponentProps<'textarea'> = {
    ...props,
    ref: setElementRef,
    value: context.value,
    disabled: context.disabled,
    readOnly: context.readOnly,
    required: context.required,
    role: 'combobox',
    'aria-expanded': context.open,
    'aria-controls': rootContext.listId,
    'aria-activedescendant': context.activeId,
    'aria-invalid': context.invalid || undefined,
    'aria-required': context.required || undefined,
    'data-invalid': context.invalid ? 'true' : undefined,
    onCompositionStart: () => {
      composing.current = true
    },
    onCompositionEnd: () => {
      composing.current = false
      syncSelection('input')
    },
    onChange: (event) => {
      onChange?.(event)
      if (!event.defaultPrevented) {
        rootContext.controller.setValue(event.currentTarget.value, getSelection(event.currentTarget))
      }
    },
    onKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => {
      onKeyDown?.(event)
      if (event.defaultPrevented || composing.current) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        rootContext.controller.setOpen(true, 'keyboard')
        rootContext.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
      } else if ((event.key === 'Enter' || event.key === 'Tab') && context.open) {
        if (rootContext.controller.selectActive()) event.preventDefault()
      } else if (event.key === 'Escape') rootContext.controller.setOpen(false, 'escape')
    },
    onClick: (event) => {
      onClick?.(event)
      if (!event.defaultPrevented) syncSelection()
    },
    onSelect: (event) => {
      onSelect?.(event)
      if (!event.defaultPrevented) syncSelection()
    },
    onFocus: (event) => {
      onFocus?.(event)
      if (!event.defaultPrevented) syncSelection()
    },
    onBlur: (event) => {
      onBlur?.(event)
      if (!event.defaultPrevented) rootContext.controller.setOpen(false, 'blur')
    },
  }

  if (children) return children({ props: inputProps, ref: setElementRef, state: context })

  return (
    <TextareaRoot
      value={context.value}
      disabled={context.disabled}
      readOnly={context.readOnly}
      invalid={context.invalid}
      status={rootContext.status}
      autoSize={autoSize}
      className={rootClassName}
      onChange={(nextValue) => rootContext.controller.setValue(nextValue, getSelection(elementRef.current))}
    >
      <TextareaInput {...inputProps} onChange={undefined} />
    </TextareaRoot>
  )
}
