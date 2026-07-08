import type { FlattenTreeNode } from '@fex/utils/tree'
import type { JSX } from 'solid-js'

export type MenuKey = string | number
export type MenuItem = MenuNodeItem | MenuGroupItem | MenuDividerItem

export interface MenuNodeItem {
  key: MenuKey
  label: JSX.Element
  icon?: JSX.Element
  suffix?: JSX.Element
  disabled?: boolean
  children?: readonly MenuItem[]
}

export interface MenuGroupItem {
  type: 'group'
  key?: MenuKey
  label?: JSX.Element
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
  selected: boolean
  expanded: boolean
  disabled: boolean
  hasChildren: boolean
}
