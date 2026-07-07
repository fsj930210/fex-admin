import { flattenTree, type FlattenTreeNode } from '@fex/utils/tree'
import type { Snippet } from 'svelte'

export type MenuKey = string | number
export type MenuItem = MenuNodeItem | MenuGroupItem | MenuDividerItem

export interface MenuNodeItem {
  key: MenuKey
  label: string | Snippet
  icon?: string | Snippet
  suffix?: string | Snippet
  disabled?: boolean
  children?: readonly MenuItem[]
}

export interface MenuGroupItem {
  type: 'group'
  key?: MenuKey
  label?: string | Snippet
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

export function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !('type' in item)
}

export function getMenuNodeEntries(items: readonly MenuItem[]) {
  return flattenTree(items, {
    getKey: (item) => (isMenuNodeItem(item) ? item.key : item.key ?? item.type),
    getChildren: (item) => (isMenuNodeItem(item) || item.type === 'group' ? item.children : undefined),
  }).filter((entry): entry is MenuNodeEntry => isMenuNodeItem(entry.node))
}

export function normalizeMenuKeys(keys: readonly MenuKey[] | undefined, multiple: boolean) {
  const result: MenuKey[] = []
  const seen = new Set<MenuKey>()
  for (const key of keys ?? []) {
    if (seen.has(key)) continue
    seen.add(key)
    result.push(key)
    if (!multiple) break
  }
  return result
}
