import {
  handleMenuListFocus,
  handleMenuListKeyDown,
  syncMenuListTabStops,
  type MenuOrientation,
} from '@fex-design/core/menu/navigation'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export function MenuRoot(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} role={props.role ?? 'menu'} data-slot="menu">{props.children}</div>
}

export type MenuListProps = ParentProps<JSX.HTMLAttributes<HTMLDivElement>> & {
  orientation?: MenuOrientation
  parentValue?: string | number
}

export function MenuList(props: MenuListProps) {
  const [local, rest] = splitProps(props, [
    'children',
    'orientation',
    'parentValue',
    'onFocus',
    'onKeyDown',
    'ref',
  ])
  let element: HTMLDivElement | undefined
  const orientation = () => local.orientation ?? 'vertical'

  return (
    <div
      {...rest}
      ref={(value) => {
        element = value
        if (typeof local.ref === 'function') local.ref(value)
        queueMicrotask(() => syncMenuListTabStops(value))
      }}
      role={rest.role ?? 'group'}
      aria-orientation={orientation()}
      data-orientation={orientation()}
      data-parent-value={local.parentValue}
      data-slot="menu-list"
      onFocus={(event) => {
        if (typeof local.onFocus === 'function') local.onFocus(event)
        if (!event.defaultPrevented) handleMenuListFocus(event)
      }}
      onKeyDown={(event) => {
        if (typeof local.onKeyDown === 'function') local.onKeyDown(event)
        if (!event.defaultPrevented && element) {
          handleMenuListKeyDown(event, element, orientation())
        }
      }}
    >
      {local.children}
    </div>
  )
}

export interface MenuItemSlot {
  props: JSX.HTMLAttributes<HTMLElement>
  state: { disabled: boolean; selected: boolean; submenu: boolean }
}

export type MenuItemProps = Omit<JSX.HTMLAttributes<HTMLElement>, 'children'> & {
  children?: JSX.Element | ((slot: MenuItemSlot) => JSX.Element)
  disabled?: boolean
  selected?: boolean
  submenu?: boolean
  value?: string | number
}

export function MenuItem(props: MenuItemProps) {
  const [local, rest] = splitProps(props, ['children', 'disabled', 'selected', 'submenu', 'value'])
  const itemProps = () => ({
    ...rest,
    role: rest.role ?? 'menuitem',
    tabIndex: local.disabled ? -1 : (rest.tabIndex ?? -1),
    'aria-disabled': local.disabled || undefined,
    'aria-haspopup': local.submenu ? 'menu' : undefined,
    'data-slot': 'menu-item',
    'data-menu-value': local.value === undefined ? undefined : String(local.value),
    'data-selected': local.selected ? 'true' : undefined,
  }) satisfies JSX.HTMLAttributes<HTMLElement>
  const state = () => ({
    disabled: Boolean(local.disabled),
    selected: Boolean(local.selected),
    submenu: Boolean(local.submenu),
  })

  if (typeof local.children === 'function') {
    return local.children({ props: itemProps(), state: state() })
  }

  return <button {...itemProps()} type="button" disabled={local.disabled}>{local.children}</button>
}

export function MenuGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} role="group" data-slot="menu-group">{props.children}</div>
}

export function MenuGroupLabel(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} data-slot="menu-group-label">{props.children}</div>
}

export function MenuDivider(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="separator" data-slot="menu-divider" />
}
