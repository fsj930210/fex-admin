import {
  handleMenuListFocus,
  handleMenuListKeyDown,
  syncMenuListTabStops,
  type MenuOrientation,
} from '@fex-design/core/menu/navigation'
import type {
  ComponentProps,
  FocusEvent,
  HTMLAttributes,
  KeyboardEvent,
  ReactNode,
  Ref,
} from 'react'
import { useRef } from 'react'
import { useComposedRef } from '../../hooks/use-composed-ref'

export interface MenuRootProps extends ComponentProps<'div'> {}

export function MenuRoot(props: MenuRootProps) {
  return <div {...props} role={props.role ?? 'menu'} data-slot="menu" />
}

export interface MenuListProps extends ComponentProps<'div'> {
  orientation?: MenuOrientation
  parentValue?: string | number
}

export function MenuList({
  orientation = 'vertical',
  parentValue,
  onFocus,
  onKeyDown,
  ref,
  ...props
}: MenuListProps) {
  const listRef = useRef<HTMLDivElement | null>(null)
  const composedRef = useComposedRef(listRef, ref)

  return (
    <div
      {...props}
      ref={(element) => {
        composedRef(element)
        if (element) syncMenuListTabStops(element)
      }}
      role={props.role ?? 'group'}
      aria-orientation={orientation}
      data-orientation={orientation}
      data-parent-value={parentValue}
      data-slot="menu-list"
      onFocus={(event: FocusEvent<HTMLDivElement>) => {
        onFocus?.(event)
        if (!event.defaultPrevented) handleMenuListFocus(event.nativeEvent)
      }}
      onKeyDown={(event: KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(event)
        if (!event.defaultPrevented && listRef.current) {
          handleMenuListKeyDown(event.nativeEvent, listRef.current, orientation)
        }
      }}
    />
  )
}

export interface MenuItemRenderProps {
  props: HTMLAttributes<HTMLElement> & {
    'data-menu-value': string
    'data-selected'?: 'true'
  }
  ref: Ref<HTMLElement>
  state: {
    disabled: boolean
    selected: boolean
    submenu: boolean
  }
}

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  children?: ReactNode | ((slot: MenuItemRenderProps) => ReactNode)
  disabled?: boolean
  selected?: boolean
  submenu?: boolean
  value?: string | number
}

export function MenuItem({
  children,
  disabled = false,
  selected = false,
  submenu = false,
  value,
  ...props
}: MenuItemProps) {
  const itemProps: MenuItemRenderProps['props'] = {
    ...props,
    role: props.role ?? 'menuitem',
    tabIndex: disabled ? -1 : (props.tabIndex ?? -1),
    'aria-disabled': disabled || undefined,
    'aria-haspopup': submenu ? 'menu' : props['aria-haspopup'],
    'data-slot': 'menu-item',
    'data-menu-value': value === undefined ? '' : String(value),
    'data-selected': selected ? 'true' : undefined,
  }
  const state = { disabled, selected, submenu }

  if (typeof children === 'function') {
    return children({ props: itemProps, ref: undefined, state })
  }

  return (
    <button {...itemProps} type="button" disabled={disabled}>
      {children}
    </button>
  )
}

export function MenuGroup(props: ComponentProps<'div'>) {
  return <div {...props} role="group" data-slot="menu-group" />
}

export function MenuGroupLabel(props: ComponentProps<'div'>) {
  return <div {...props} data-slot="menu-group-label" />
}

export function MenuDivider(props: ComponentProps<'div'>) {
  return <div {...props} role="separator" data-slot="menu-divider" />
}
