export { createMenu } from './create-menu'
import type { JSX, ParentProps } from 'solid-js'

export function MenuRoot(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} role="menu" data-slot="menu">{props.children}</div>
}

export function MenuList(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} role="group" data-slot="menu-list">{props.children}</div>
}

export function MenuItem(props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>) {
  return <button {...props} type="button" role="menuitem" data-slot="menu-item">{props.children}</button>
}

export function MenuGroup(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  return <div {...props} role="group" data-slot="menu-group">{props.children}</div>
}

export function MenuDivider(props: JSX.HTMLAttributes<HTMLDivElement>) {
  return <div {...props} role="separator" data-slot="menu-divider" />
}
export type {
  MenuDividerItem,
  MenuGroupItem,
  MenuItem,
  MenuKey,
  MenuNodeEntry,
  MenuNodeItem,
  MenuRenderItemInfo,
} from './menu-types'
