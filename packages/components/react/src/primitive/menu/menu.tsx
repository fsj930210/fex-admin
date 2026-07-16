import type { ComponentProps, ReactNode } from 'react'
import { MenuContext, useMenuContext } from './menu-context'
import type {
  MenuListDomProps,
  UseMenuOptions,
  UseMenuReturn,
} from './menu-types'
import { useMenu } from './use-menu'

export interface MenuRootProps extends Omit<ComponentProps<'div'>, 'children' | 'onClick' | 'onSelect'>, UseMenuOptions {
  children?: ReactNode | ((menu: UseMenuReturn) => ReactNode)
}

export function MenuRoot({ children, items, className, style, ...options }: MenuRootProps) {
  const menu = useMenu({ ...options, items })
  const rootProps = menu.getRootProps({ className, style })

  return (
    <MenuContext value={menu}>
      <div {...rootProps}>{typeof children === 'function' ? children(menu) : children}</div>
    </MenuContext>
  )
}

export function MenuList(props: MenuListDomProps) {
  const menu = useMenuContext('MenuList')
  return <div {...menu.getListProps(props)} />
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

export { useMenu, useMenuContext }
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
