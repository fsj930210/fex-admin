import type { ComponentProps } from 'react'
import { useMenu } from './use-menu'

export interface MenuRootProps extends ComponentProps<'div'> {}

export function MenuRoot(props: MenuRootProps) {
  return <div {...props} role={props.role ?? 'menu'} data-slot="menu" />
}

export function MenuList(props: ComponentProps<'div'>) {
  return <div {...props} role={props.role ?? 'group'} data-slot="menu-list" />
}

export function MenuItem(props: ComponentProps<'button'>) {
  return <button {...props} type={props.type ?? 'button'} role="menuitem" data-slot="menu-item" />
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

export { useMenu }
export type {
  FlattenTreeNode,
  MenuClickInfo,
  MenuDividerItem,
  MenuExpandInfo,
  MenuGroupItem,
  MenuItem,
  MenuItemPropOptions,
  MenuKey,
  MenuListDomProps,
  MenuNodeEntry,
  MenuNodeItem,
  MenuRenderItemInfo,
  MenuRootDomProps,
  MenuSelectInfo,
  MenuSubMenuContentDomProps,
  UseMenuOptions,
  UseMenuReturn,
} from './menu-types'
