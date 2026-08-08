import { createMentionsController } from '@fex-design/core/mentions/create-mentions-controller'
import type { MentionsChangeMeta, MentionsControllerConfig, MentionsKey, MentionsOpenReason, MentionsParseInput, MentionsQuery, MentionsRegisteredItem, MentionsSearchMeta, MentionsSelectMeta } from '@fex-design/core/mentions/types'
import { mentionsContentClassName, mentionsItemClassName, mentionsListClassName, mentionsRootClassName } from '@fex-design/styles/mentions'
import { cn } from '@fex/utils'
import { Show, createContext, createEffect, createMemo, createUniqueId, onCleanup, splitProps, useContext, type Accessor, type JSX, type ParentProps } from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { ListboxItem, ListboxRoot } from '../listbox/listbox'
import { TextareaInput, TextareaRoot } from '../textarea/textarea'

interface MentionsContextValue {
  controller: ReturnType<typeof createMentionsController>
  snapshot: Accessor<ReturnType<ReturnType<typeof createMentionsController>['getSnapshot']>>
  listId: string
  disabled: Accessor<boolean>
  readOnly: Accessor<boolean>
  invalid: Accessor<boolean>
  required: Accessor<boolean>
}

const MentionsContext = createContext<MentionsContextValue>()

function useMentionsContext(component: string) {
  const context = useContext(MentionsContext)
  if (!context) throw new Error(component + ' must be used inside MentionsRoot.')
  return context
}

function normalizePrefix(prefix: string | readonly string[] | undefined) {
  return Array.isArray(prefix) ? prefix : prefix ? [prefix] : ['@']
}

function getSelection(element: HTMLTextAreaElement | undefined) {
  return { start: element?.selectionStart ?? 0, end: element?.selectionEnd ?? 0 }
}

export interface MentionsRootProps<TData = unknown>
  extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'onChange'>> {
  value?: string | undefined
  defaultValue?: string | undefined
  onChange?: ((value: string, meta: MentionsChangeMeta) => void) | undefined
  prefix?: string | readonly string[] | undefined
  open?: boolean | undefined
  defaultOpen?: boolean | undefined
  onOpenChange?: ((open: boolean, meta: { reason: MentionsOpenReason }) => void) | undefined
  onSearch?: ((text: string, meta: MentionsSearchMeta) => void) | undefined
  onSelect?: ((item: MentionsRegisteredItem<TData>, meta: MentionsSelectMeta) => void) | undefined
  parseQuery?: ((input: MentionsParseInput) => MentionsQuery | null) | undefined
  disabled?: boolean | undefined
  readOnly?: boolean | undefined
  invalid?: boolean | undefined
  required?: boolean | undefined
  status?: 'error' | 'warning' | undefined
}

export function MentionsRoot<TData = unknown>(props: MentionsRootProps<TData>) {
  const [local, rest] = splitProps(props, [
    'children', 'class', 'value', 'defaultValue', 'prefix', 'open', 'defaultOpen',
    'onChange', 'onOpenChange', 'onSearch', 'onSelect', 'parseQuery', 'disabled',
    'readOnly', 'invalid', 'required', 'status',
  ])
  const config: MentionsControllerConfig<TData> = {
    get value() {
      return props.value
    },
    get defaultValue() {
      return props.defaultValue
    },
    get open() {
      return props.open
    },
    get defaultOpen() {
      return props.defaultOpen
    },
    get prefixes() {
      return normalizePrefix(props.prefix)
    },
    get parseQuery() {
      return props.parseQuery
    },
    onChange: (value, meta) => props.onChange?.(value, meta),
    onOpenChange: (open, meta) => props.onOpenChange?.(open, meta),
    onSearch: (text, meta) => props.onSearch?.(text, meta),
    onSelect: (item, meta) => props.onSelect?.(item as MentionsRegisteredItem<TData>, meta),
  }
  const controller = createMentionsController<TData>(config)
  const snapshot = createCoreStoreSignal(controller)
  const context: MentionsContextValue = {
    controller,
    snapshot,
    listId: 'mentions-' + createUniqueId(),
    disabled: () => props.disabled === true,
    readOnly: () => props.readOnly === true,
    invalid: () => props.invalid === true || props.status === 'error',
    required: () => props.required === true,
  }
  return (
    <MentionsContext.Provider value={context}>
      <div {...rest} data-slot="mentions-root" class={cn(mentionsRootClassName, local.class)}>
        {local.children}
      </div>
    </MentionsContext.Provider>
  )
}

export function useMentions() {
  const context = useMentionsContext('useMentions')
  return {
    value: () => context.snapshot().value,
    open: () => context.snapshot().open,
    query: () => context.snapshot().query,
    prefix: () => context.snapshot().query?.prefix ?? null,
    text: () => context.snapshot().query?.text ?? '',
    activeKey: () => context.snapshot().activeKey,
    activeId: () =>
      context.snapshot().activeKey === undefined
        ? undefined
        : context.listId + '-' + context.snapshot().activeKey,
    disabled: context.disabled,
    readOnly: context.readOnly,
    invalid: context.invalid,
    required: context.required,
    close: () => context.controller.setOpen(false, 'programmatic'),
    selectItem: (key: MentionsKey) => context.controller.selectItem(key),
  }
}

export function MentionsTrigger(
  props: Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, 'children'> & {
    rootClass?: string
    children?: (input: {
      props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>
      state: ReturnType<typeof useMentions>
      ref: (element: HTMLTextAreaElement) => void
    }) => JSX.Element
  },
) {
  const context = useMentionsContext('MentionsTrigger')
  const [local, rest] = splitProps(props, [
    'children', 'class', 'rootClass', 'onInput', 'onKeyDown', 'onClick',
    'onSelect', 'onFocus', 'onBlur', 'ref',
  ])
  let element: HTMLTextAreaElement | undefined
  let composing = false
  const mentions = useMentions()
  const syncSelection = () => context.controller.setSelection(getSelection(element))
  const setElement = (node: HTMLTextAreaElement) => {
    element = node
    if (typeof local.ref === 'function') local.ref(node)
  }
  const triggerProps = createMemo<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>>(() => ({
    ...rest,
    value: context.snapshot().value,
    disabled: context.disabled(),
    readOnly: context.readOnly(),
    required: context.required(),
    role: 'combobox',
    'aria-expanded': context.snapshot().open,
    'aria-controls': context.listId,
    'aria-activedescendant':
      context.snapshot().activeKey === undefined
        ? undefined
        : context.listId + '-' + context.snapshot().activeKey,
    'aria-invalid': context.invalid() || undefined,
     'aria-required': context.required() || undefined,
     onInput: (event) => {
       if (typeof local.onInput === 'function') local.onInput(event)
       if (!event.defaultPrevented) context.controller.setValue(event.currentTarget.value, getSelection(event.currentTarget))
     },
    onKeyDown: (event) => {
      if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
      if (event.defaultPrevented || composing) return
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault()
        context.controller.setOpen(true, 'keyboard')
        context.controller.moveActive(event.key === 'ArrowDown' ? 1 : -1)
      } else if ((event.key === 'Enter' || event.key === 'Tab') && context.snapshot().open) {
        if (context.controller.selectActive()) event.preventDefault()
      } else if (event.key === 'Escape') context.controller.setOpen(false, 'escape')
    },
    onClick: (event) => {
      if (typeof local.onClick === 'function') local.onClick(event)
      if (!event.defaultPrevented) syncSelection()
    },
    onSelect: (event) => {
      if (typeof local.onSelect === 'function') local.onSelect(event)
      if (!event.defaultPrevented) syncSelection()
    },
    onFocus: (event) => {
      if (typeof local.onFocus === 'function') local.onFocus(event)
      if (!event.defaultPrevented) syncSelection()
    },
    onBlur: (event) => {
      if (typeof local.onBlur === 'function') local.onBlur(event)
      if (!event.defaultPrevented) context.controller.setOpen(false, 'blur')
    },
    onCompositionStart: () => {
      composing = true
    },
     onCompositionEnd: (event) => {
       composing = false
       context.controller.setValue(event.currentTarget.value, getSelection(event.currentTarget))
     },
   }))

  if (local.children) return local.children({ props: triggerProps(), state: mentions, ref: setElement })

  return (
    <TextareaRoot
      class={local.rootClass}
      value={context.snapshot().value}
      disabled={context.disabled()}
      readOnly={context.readOnly()}
      invalid={context.invalid()}
      onChange={(value) => context.controller.setValue(value, getSelection(element))}
    >
      <TextareaInput
        {...triggerProps()}
        ref={setElement}
        class={local.class}
      />
    </TextareaRoot>
  )
}

export function MentionsContent(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const context = useMentionsContext('MentionsContent')
  const [local, rest] = splitProps(props, ['children', 'class'])
  return (
    <Show when={context.snapshot().open && context.snapshot().query}>
      <div
        {...rest}
        data-slot="mentions-content"
        class={cn(mentionsContentClassName, 'absolute left-0 top-full mt-1 min-w-64', local.class)}
      >
        {local.children}
      </div>
    </Show>
  )
}

export function MentionsList(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const context = useMentionsContext('MentionsList')
  return (
    <ListboxRoot
      {...props}
      id={context.listId}
      value={context.snapshot().activeKey}
      onChange={(value) => context.controller.setActiveKey(Array.isArray(value) ? value[0] : value)}
      class={cn(mentionsListClassName, props.class)}
    >
      {props.children}
    </ListboxRoot>
  )
}

export interface MentionsItemProps<TData = unknown>
  extends ParentProps<Omit<JSX.HTMLAttributes<HTMLDivElement>, 'value'>> {
  itemKey?: MentionsKey | undefined
  value: string
  disabled?: boolean | undefined
  data?: TData | undefined
}

export function MentionsItem<TData = unknown>(props: MentionsItemProps<TData>) {
  const context = useMentionsContext('MentionsItem')
  const key = createMemo(() => props.itemKey ?? props.value)
  const active = createMemo(() => context.snapshot().activeKey === key())
  createEffect(() => {
    const unregister = context.controller.registerItem({
      key: key(),
      value: props.value,
      disabled: props.disabled === true,
      data: props.data,
    })
    onCleanup(unregister)
  })
  return (
    <ListboxItem
      id={context.listId + '-' + key()}
      value={key()}
      disabled={props.disabled}
      class={cn(mentionsItemClassName, props.class)}
      onPointerMove={() => context.controller.setActiveKey(key(), 'pointer')}
      onPointerDown={(event) => event.preventDefault()}
      onSelect={() => context.controller.selectItem(key())}
    >
      {props.children ?? props.value}
    </ListboxItem>
  )
}

export function MentionsPrefixCase(props: ParentProps<{ prefix: string }>) {
  const mentions = useMentions()
  return <Show when={mentions.prefix() === props.prefix}>{props.children}</Show>
}
