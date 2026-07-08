import type { FlattenTreeNode } from '@fex/utils/tree'
import type { ComponentProps, KeyboardEvent, MouseEvent, ReactNode } from 'react'

export type MenuKey = string | number

export type MenuItem = MenuNodeItem | MenuGroupItem | MenuDividerItem

export interface MenuNodeItem {
  key: MenuKey
  label: ReactNode
  icon?: ReactNode
  suffix?: ReactNode
  disabled?: boolean
  children?: readonly MenuItem[]
}

export interface MenuGroupItem {
  type: 'group'
  key?: MenuKey
  label?: ReactNode
  children: readonly MenuNodeItem[]
}

export interface MenuDividerItem {
  type: 'divider'
  key?: MenuKey
}

export interface MenuNodeEntry extends Omit<FlattenTreeNode<MenuItem, MenuKey>, 'node'> {
  node: MenuNodeItem
}

export interface MenuRenderItemInfo {
  item: MenuNodeItem
  key: MenuKey
  level: number
  index: number
  parent?: MenuNodeItem
  selected: boolean
  expanded: boolean
  disabled: boolean
  hasChildren: boolean
}

export interface MenuClickInfo extends MenuRenderItemInfo {
  event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>
}

export interface MenuSelectInfo extends MenuRenderItemInfo {
  selectedKeys: MenuKey[]
  previousSelectedKeys: MenuKey[]
}

export interface MenuExpandInfo extends MenuRenderItemInfo {
  expandKeys: MenuKey[]
  previousExpandKeys: MenuKey[]
}

export interface UseMenuOptions {
  items?: readonly MenuItem[] | undefined
  expandKeys?: readonly MenuKey[] | undefined
  defaultExpandKeys?: readonly MenuKey[] | undefined
  expandMultiple?: boolean | undefined
  selectedKeys?: readonly MenuKey[] | undefined
  defaultSelectedKeys?: readonly MenuKey[] | undefined
  selectMultiple?: boolean | undefined
  selectable?: boolean | undefined
  disabled?: boolean | undefined
  onExpandChange?: ((keys: MenuKey[], info: MenuExpandInfo) => void) | undefined
  onSelect?: ((keys: MenuKey[], info: MenuSelectInfo) => void) | undefined
  onDeselect?: ((keys: MenuKey[], info: MenuSelectInfo) => void) | undefined
  onClick?: ((info: MenuClickInfo) => void) | undefined
}

export interface MenuItemPropOptions {
  hidden?: boolean
}

export type MenuDataAttributes = Partial<Record<`data-${string}`, string | number | boolean | undefined>>
export type MenuRootDomProps = ComponentProps<'div'> & MenuDataAttributes
export type MenuListDomProps = ComponentProps<'div'> & MenuDataAttributes
export type MenuSubMenuContentDomProps = ComponentProps<'div'> & MenuDataAttributes

export interface UseMenuReturn {
  items: readonly MenuItem[]
  nodeItems: MenuNodeEntry[]
  expandKeys: MenuKey[]
  selectedKeys: MenuKey[]
  getRootProps: (props?: MenuRootDomProps) => MenuRootDomProps
  getListProps: (props?: MenuListDomProps) => MenuListDomProps
  getItemInfo: (entry: MenuNodeEntry) => MenuRenderItemInfo
  getItemProps: (
    entry: MenuNodeEntry,
    props?: ComponentProps<'button'>,
    options?: MenuItemPropOptions,
  ) => ComponentProps<'button'>
  getSubMenuContentProps: (
    entry: MenuNodeEntry,
    props?: MenuSubMenuContentDomProps,
  ) => MenuSubMenuContentDomProps
  isExpanded: (key: MenuKey) => boolean
  isSelected: (key: MenuKey) => boolean
  toggleExpand: (key: MenuKey) => void
  selectItem: (key: MenuKey) => void
  clickItem: (
    info: MenuRenderItemInfo,
    event: MouseEvent<HTMLElement> | KeyboardEvent<HTMLElement>,
  ) => void
}

export type { FlattenTreeNode }
