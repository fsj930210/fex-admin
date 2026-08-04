import { createExpansionController } from '@fex-design/core/expansion/create-expansion-controller'
import type { ExpansionChangeMeta, ExpansionKey } from '@fex-design/core/expansion/types'
import {
  collapseContentInnerClassName,
  collapseContentOuterClassName,
  collapseIconClassName,
  collapseItemClassName,
  collapseRootClassName,
  collapseTriggerClassName,
  type CollapseStyleProps,
} from '@fex-design/styles/collapse'
import { cn } from '@fex/utils'
import {
  createContext,
  createEffect,
  createMemo,
  createUniqueId,
  mergeProps,
  splitProps,
  useContext,
  type JSX,
  type ParentProps,
} from 'solid-js'
import { createCoreStoreSignal } from '../../primitives/create-core-store-signal'
import { ChevronRightIcon } from '../../icon/chevron'
import { Button } from '../button/button'

type CollapseVariant = NonNullable<CollapseStyleProps['variant']>
type CollapseSize = NonNullable<CollapseStyleProps['size']>

export interface CollapseRef {
  expand: (key: ExpansionKey) => void
  collapse: (key: ExpansionKey) => void
  toggle: (key: ExpansionKey) => void
  setExpandedKeys: (keys: ExpansionKey[]) => void
  clear: () => void
  getExpandedKeys: () => ExpansionKey[]
  isExpanded: (key: ExpansionKey) => boolean
  isDisabled: (key: ExpansionKey) => boolean
}

interface CollapseContextValue extends CollapseRef {
  baseId: string
  snapshot: () => { expandedKeys: ExpansionKey[]; multiple: boolean }
  variant: () => CollapseVariant
  size: () => CollapseSize
}

interface CollapseItemContextValue {
  value: ExpansionKey
  disabled: () => boolean
  triggerId: string
  contentId: string
}

const CollapseContext = createContext<CollapseContextValue>()
const CollapseItemContext = createContext<CollapseItemContextValue>()

export function useCollapseContext() {
  const context = useContext(CollapseContext)
  if (!context) throw new Error('Collapse components must be used inside Collapse.')
  return context
}

export function useCollapseItemContext() {
  const context = useContext(CollapseItemContext)
  if (!context) throw new Error('Collapse item parts must be used inside CollapseItem.')
  return context
}

export interface CollapseProps extends Omit<
  JSX.HTMLAttributes<HTMLDivElement>,
  'children' | 'onChange' | 'ref'
> {
  expandedKeys?: readonly ExpansionKey[]
  defaultExpandedKeys?: readonly ExpansionKey[]
  disabledKeys?: readonly ExpansionKey[]
  multiple?: boolean
  collapsible?: boolean
  variant?: CollapseVariant
  size?: CollapseSize
  ref?: (value: CollapseRef) => void
  onChange?: (keys: ExpansionKey[], meta: ExpansionChangeMeta) => void
  children?: JSX.Element
}

export function Collapse(props: CollapseProps) {
  const [local, rest] = splitProps(mergeProps({ multiple: true, collapsible: true }, props), [
    'expandedKeys',
    'defaultExpandedKeys',
    'disabledKeys',
    'multiple',
    'collapsible',
    'variant',
    'size',
    'ref',
    'onChange',
    'class',
    'children',
  ])
  const controller = createExpansionController({
    get expandedKeys() {
      return local.expandedKeys
    },
    get defaultExpandedKeys() {
      return local.defaultExpandedKeys
    },
    get disabledKeys() {
      return local.disabledKeys
    },
    get multiple() {
      return local.multiple
    },
    get collapsible() {
      return local.collapsible
    },
    onChange(keys, meta) {
      local.onChange?.(keys, meta)
    },
  })
  const snapshot = createCoreStoreSignal(controller)
  createEffect(() => {
    local.expandedKeys
    local.disabledKeys
    local.multiple
    local.collapsible
    controller.refresh()
  })
  const api: CollapseRef = {
    expand: controller.expand,
    collapse: controller.collapse,
    toggle: controller.toggle,
    setExpandedKeys: (keys) => controller.setExpandedKeys(keys),
    clear: controller.clear,
    getExpandedKeys: () => controller.getSnapshot().expandedKeys,
    isExpanded: controller.isExpanded,
    isDisabled: controller.isDisabled,
  }
  local.ref?.(api)
  const context: CollapseContextValue = {
    ...api,
    baseId: createUniqueId(),
    snapshot,
    variant: () => local.variant ?? 'outlined',
    size: () => local.size ?? 'md',
  }
  return (
    <CollapseContext.Provider value={context}>
      <div
        {...rest}
        data-slot="collapse"
        data-variant={context.variant()}
        class={cn(collapseRootClassName({ variant: context.variant(), size: context.size() }), local.class)}
      >
        {local.children}
      </div>
    </CollapseContext.Provider>
  )
}

export interface CollapseItemProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  value: ExpansionKey
  disabled?: boolean
  children?:
    | JSX.Element
    | ((value: {
        state: { expanded: boolean; disabled: boolean }
        actions: { expand(): void; collapse(): void; toggle(): void }
      }) => JSX.Element)
}

export function CollapseItem(props: CollapseItemProps) {
  const [local, rest] = splitProps(props, ['value', 'disabled', 'class', 'children'])
  const collapse = useCollapseContext()
  const safeValue = String(local.value).replace(/\s+/g, '-') || createUniqueId()
  const state = createMemo(() => ({
    expanded: collapse.snapshot().expandedKeys.includes(local.value),
    disabled: local.disabled === true || collapse.isDisabled(local.value),
  }))
  const context: CollapseItemContextValue = {
    value: local.value,
    disabled: () => state().disabled,
    triggerId: collapse.baseId + '-' + safeValue + '-trigger',
    contentId: collapse.baseId + '-' + safeValue + '-content',
  }
  return (
    <CollapseItemContext.Provider value={context}>
      <div
        {...rest}
        data-slot="collapse-item"
        data-state={state().expanded ? 'open' : 'closed'}
        data-disabled={state().disabled || undefined}
        class={cn(collapseItemClassName({ variant: collapse.variant() }), local.class)}
      >
        {typeof local.children === 'function'
          ? local.children({
              state: state(),
              actions: {
                expand: () => collapse.expand(local.value),
                collapse: () => collapse.collapse(local.value),
                toggle: () => collapse.toggle(local.value),
              },
            })
          : local.children}
      </div>
    </CollapseItemContext.Provider>
  )
}

export interface CollapseTriggerProps
  extends Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  showIcon?: boolean
  children?:
    | JSX.Element
    | ((value: {
        props: JSX.ButtonHTMLAttributes<HTMLButtonElement>
        state: { expanded: boolean; disabled: boolean }
        icon: JSX.Element | null
      }) => JSX.Element)
}

export function CollapseTrigger(props: CollapseTriggerProps) {
  const [local, rest] = splitProps(props, ['class', 'children', 'showIcon', 'onClick'])
  const collapse = useCollapseContext()
  const item = useCollapseItemContext()
  const state = createMemo(() => ({
    expanded: collapse.snapshot().expandedKeys.includes(item.value),
    disabled: item.disabled() || collapse.isDisabled(item.value),
  }))
  const handleClick = (event: MouseEvent) => {
    ;(local.onClick as ((event: MouseEvent) => void) | undefined)?.(event)
    if (!event.defaultPrevented && !state().disabled) collapse.toggle(item.value)
  }
  const triggerProps = {
    ...rest,
    type: rest.type ?? 'button',
    id: item.triggerId,
    disabled: state().disabled,
    'aria-expanded': state().expanded,
    'aria-controls': item.contentId,
    'data-slot': 'collapse-trigger',
    'data-state': state().expanded ? 'open' : 'closed',
    class: cn(collapseTriggerClassName({ variant: collapse.variant() }), local.class),
    onClick: handleClick,
  }
  if (typeof local.children === 'function') {
    return local.children({
      props: triggerProps,
      state: state(),
      icon:
        local.showIcon === false ? null : (
          <ChevronRightIcon
            class={cn(collapseIconClassName, state().expanded && '-rotate-90')}
          />
        ),
    })
  }
  return (
    <Button
      {...rest}
      type={rest.type ?? 'button'}
      id={item.triggerId}
      disabled={state().disabled}
      aria-expanded={state().expanded}
      aria-controls={item.contentId}
      data-slot="collapse-trigger"
      data-state={state().expanded ? 'open' : 'closed'}
      class={cn(collapseTriggerClassName({ variant: collapse.variant() }), local.class)}
      onClick={handleClick}
    >
      <span class="min-w-0 flex-1">{local.children}</span>
      {local.showIcon === false ? null : (
        <ChevronRightIcon
          class={cn(collapseIconClassName, state().expanded ? '-rotate-90' : '')}
        />
      )}
    </Button>
  )
}

export interface CollapseContentProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: JSX.Element | ((value: { expanded: boolean }) => JSX.Element)
}

export function CollapseContent(props: CollapseContentProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  const collapse = useCollapseContext()
  const item = useCollapseItemContext()
  const expanded = () => collapse.snapshot().expandedKeys.includes(item.value)
  return (
    <div
      data-slot="collapse-content-outer"
      data-state={expanded() ? 'open' : 'closed'}
      class={collapseContentOuterClassName}
    >
      <div
        {...rest}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        aria-hidden={!expanded()}
        data-slot="collapse-content"
        data-state={expanded() ? 'open' : 'closed'}
        class={cn(collapseContentInnerClassName({ variant: collapse.variant() }), local.class)}
      >
        {typeof local.children === 'function' ? local.children({ expanded: expanded() }) : local.children}
      </div>
    </div>
  )
}

export { Collapse as CollapseRoot }
