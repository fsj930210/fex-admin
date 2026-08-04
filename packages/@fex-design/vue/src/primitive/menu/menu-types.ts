import type { FlattenTreeNode } from '@fex/utils/tree'
import type { VNodeChild } from 'vue'

export type MenuKey = string | number
export type MenuItem = MenuNodeItem | MenuGroupItem | MenuDividerItem

export interface MenuNodeItem {
  key: MenuKey
  label: VNodeChild
  icon?: VNodeChild
  suffix?: VNodeChild
  disabled?: boolean
  children?: readonly MenuItem[]
}

export interface MenuGroupItem {
  type: 'group'
  key?: MenuKey
  label?: VNodeChild
  children: readonly MenuNodeItem[]
}

export interface MenuDividerItem {
  type: 'divider'
  key?: MenuKey
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

export interface MenuNodeEntry extends Omit<FlattenTreeNode<MenuItem, MenuKey>, 'node'> {
  node: MenuNodeItem
}
