import {
  collapseContentInnerClassName,
  collapseContentOuterClassName,
  collapseIconClassName,
  collapseItemClassName,
  collapseRootClassName,
  collapseTriggerClassName,
} from '@fex-design/styles/collapse'
import type { ExpansionChangeMeta, ExpansionKey } from '@fex-design/core/expansion/types'
import { cn } from '@fex/utils'
import { useId } from 'react'
import type {
  ButtonHTMLAttributes,
  HTMLAttributes,
  ReactElement,
  ReactNode,
  Ref,
} from 'react'
import { Button } from '../button/button'
import { ChevronRightIcon } from '../../icon/chevron'
import {
  CollapseContext,
  CollapseItemContext,
  useCollapseContext,
  useCollapseItemContext,
  type CollapseSize,
  type CollapseVariant,
} from './collapse-context'
import { useCollapse, type CollapseRef } from './use-collapse'

type RenderChild<T> = (context: T) => ReactElement | null
type CollapseTriggerDOMProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  'data-slot': 'collapse-trigger'
  'data-state': 'open' | 'closed'
}

export interface CollapseProps
  extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  expandedKeys?: readonly ExpansionKey[]
  defaultExpandedKeys?: readonly ExpansionKey[]
  disabledKeys?: readonly ExpansionKey[]
  multiple?: boolean
  collapsible?: boolean
  variant?: CollapseVariant
  size?: CollapseSize
  ref?: Ref<CollapseRef>
  onChange?: (keys: ExpansionKey[], meta: ExpansionChangeMeta) => void
  children?: ReactNode
}

export function Collapse({
  expandedKeys,
  defaultExpandedKeys,
  disabledKeys,
  multiple,
  collapsible,
  onChange,
  variant = 'outlined',
  size = 'md',
  className,
  children,
  ref,
  ...props
}: CollapseProps) {
  const collapse = useCollapse({
    ...(expandedKeys === undefined ? {} : { expandedKeys }),
    ...(defaultExpandedKeys === undefined ? {} : { defaultExpandedKeys }),
    ...(disabledKeys === undefined ? {} : { disabledKeys }),
    ...(multiple === undefined ? {} : { multiple }),
    ...(collapsible === undefined ? {} : { collapsible }),
    ...(onChange === undefined ? {} : { onChange }),
    ...(ref === undefined ? {} : { ref }),
  })
  return (
    <CollapseContext value={{ ...collapse, variant, size }}>
      <div
        {...props}
        data-slot="collapse"
        data-variant={variant}
        className={cn(collapseRootClassName({ variant, size }), className)}
      >
        {children}
      </div>
    </CollapseContext>
  )
}

export interface CollapseItemState {
  expanded: boolean
  disabled: boolean
}

export interface CollapseItemActions {
  expand: () => void
  collapse: () => void
  toggle: () => void
}

export interface CollapseItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  value: ExpansionKey
  disabled?: boolean
  children?: ReactNode | RenderChild<{ state: CollapseItemState; actions: CollapseItemActions }>
}

export function CollapseItem({
  value,
  disabled = false,
  className,
  children,
  ...props
}: CollapseItemProps) {
  const collapse = useCollapseContext('CollapseItem')
  const fallbackId = useId()
  const state = {
    expanded: collapse.isExpanded(value),
    disabled: disabled || collapse.isDisabled(value),
  }
  const actions = {
    expand: () => collapse.expand(value),
    collapse: () => collapse.collapse(value),
    toggle: () => collapse.toggle(value),
  }
  const safeValue = String(value).replace(/\s+/g, '-')
  const itemContext = {
    value,
    disabled: state.disabled,
    triggerId: collapse.baseId + '-' + (safeValue || fallbackId) + '-trigger',
    contentId: collapse.baseId + '-' + (safeValue || fallbackId) + '-content',
  }
  return (
    <CollapseItemContext value={itemContext}>
      <div
        {...props}
        data-slot="collapse-item"
        data-state={state.expanded ? 'open' : 'closed'}
        data-disabled={state.disabled || undefined}
        className={cn(collapseItemClassName({ variant: collapse.variant }), className)}
      >
        {typeof children === 'function' ? children({ state, actions }) : children}
      </div>
    </CollapseItemContext>
  )
}

export interface CollapseTriggerRenderProps {
  props: CollapseTriggerDOMProps
  state: CollapseItemState
  icon: ReactNode
}

export interface CollapseTriggerProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  showIcon?: boolean
  children?: ReactNode | RenderChild<CollapseTriggerRenderProps>
}

export function CollapseTrigger({
  className,
  children,
  onClick,
  showIcon = true,
  ...props
}: CollapseTriggerProps) {
  const collapse = useCollapseContext('CollapseTrigger')
  const item = useCollapseItemContext('CollapseTrigger')
  const state = {
    expanded: collapse.isExpanded(item.value),
    disabled: item.disabled || collapse.isDisabled(item.value),
  }
  const icon = showIcon ? <ChevronRightIcon className={collapseIconClassName} /> : null
  const triggerProps: CollapseTriggerDOMProps = {
    ...props,
    type: props.type ?? 'button',
    id: item.triggerId,
    disabled: state.disabled,
    'aria-expanded': state.expanded,
    'aria-controls': item.contentId,
    'data-slot': 'collapse-trigger',
    'data-state': state.expanded ? 'open' : 'closed',
    className: cn(collapseTriggerClassName({ variant: collapse.variant }), className),
    onClick: (event) => {
      onClick?.(event)
      if (!event.defaultPrevented && !state.disabled) collapse.toggle(item.value)
    },
  }
  if (typeof children === 'function') return children({ props: triggerProps, state, icon })
  return (
    <Button {...triggerProps}>
      <span className="min-w-0 flex-1">{children}</span>
      {icon}
    </Button>
  )
}

export interface CollapseContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: ReactNode | RenderChild<{ expanded: boolean }>
}

export function CollapseContent({ className, children, ...props }: CollapseContentProps) {
  const collapse = useCollapseContext('CollapseContent')
  const item = useCollapseItemContext('CollapseContent')
  const expanded = collapse.isExpanded(item.value)
  return (
    <div
      data-slot="collapse-content-outer"
      data-state={expanded ? 'open' : 'closed'}
      className={collapseContentOuterClassName}
    >
      <div
        {...props}
        id={item.contentId}
        role="region"
        aria-labelledby={item.triggerId}
        aria-hidden={!expanded}
        data-slot="collapse-content"
        data-state={expanded ? 'open' : 'closed'}
        className={cn(collapseContentInnerClassName({ variant: collapse.variant }), className)}
      >
        {typeof children === 'function' ? children({ expanded }) : children}
      </div>
    </div>
  )
}

export { useCollapse, useCollapseContext, useCollapseItemContext, type CollapseRef }
