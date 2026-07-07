import { flattenTree, type FlattenTreeNode } from '@fex/utils/tree'
import { createMemo, createSignal, type Accessor, type JSX } from 'solid-js'

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

function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !('type' in item)
}

function getMenuItemKey(item: MenuItem) {
  return isMenuNodeItem(item) ? item.key : item.key ?? item.type
}

function getMenuItemChildren(item: MenuItem) {
  return isMenuNodeItem(item) || item.type === 'group' ? item.children : undefined
}

function normalizeKeys(keys: readonly MenuKey[] | undefined, multiple: boolean) {
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

export function createMenu(props: {
  items?: Accessor<readonly MenuItem[]>
  expandKeys?: Accessor<readonly MenuKey[] | undefined>
  defaultExpandKeys?: readonly MenuKey[]
  expandMultiple?: Accessor<boolean>
  selectedKeys?: Accessor<readonly MenuKey[] | undefined>
  defaultSelectedKeys?: readonly MenuKey[]
  selectMultiple?: Accessor<boolean>
  selectable?: Accessor<boolean>
  disabled?: Accessor<boolean>
  onExpandChange?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
  onSelect?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
}) {
  const [uncontrolledExpandKeys, setUncontrolledExpandKeys] = createSignal(normalizeKeys(props.defaultExpandKeys, props.expandMultiple?.() ?? true))
  const [uncontrolledSelectedKeys, setUncontrolledSelectedKeys] = createSignal(normalizeKeys(props.defaultSelectedKeys, props.selectMultiple?.() ?? false))
  const items = createMemo(() => props.items?.() ?? [])
  const nodeItems = createMemo(() =>
    flattenTree(items(), { getKey: getMenuItemKey, getChildren: getMenuItemChildren }).filter(
      (entry): entry is MenuNodeEntry => isMenuNodeItem(entry.node),
    ),
  )
  const currentExpandKeys = createMemo(() => [...(props.expandKeys?.() ?? uncontrolledExpandKeys())])
  const currentSelectedKeys = createMemo(() => [...(props.selectedKeys?.() ?? uncontrolledSelectedKeys())])

  function getItemInfo(entry: MenuNodeEntry): MenuRenderItemInfo {
    return {
      item: entry.node,
      key: entry.key,
      level: entry.level,
      index: entry.index,
      selected: currentSelectedKeys().includes(entry.key),
      expanded: currentExpandKeys().includes(entry.key),
      disabled: props.disabled?.() === true || entry.node.disabled === true,
      hasChildren: entry.hasChildren,
    }
  }

  function setExpandKeys(keys: MenuKey[], info: MenuRenderItemInfo) {
    const normalized = normalizeKeys(keys, props.expandMultiple?.() ?? true)
    if (props.expandKeys?.() === undefined) setUncontrolledExpandKeys(normalized)
    props.onExpandChange?.(normalized, info)
  }

  function setSelectedKeys(keys: MenuKey[], info: MenuRenderItemInfo) {
    const normalized = normalizeKeys(keys, props.selectMultiple?.() ?? false)
    if (props.selectedKeys?.() === undefined) setUncontrolledSelectedKeys(normalized)
    props.onSelect?.(normalized, info)
  }

  function clickItem(info: MenuRenderItemInfo) {
    if (info.disabled) return
    if (info.hasChildren) {
      setExpandKeys(info.expanded ? currentExpandKeys().filter((key) => key !== info.key) : [...currentExpandKeys(), info.key], info)
      return
    }
    if (props.selectable?.() === false) return
    setSelectedKeys(
      props.selectMultiple?.() === true
        ? info.selected
          ? currentSelectedKeys().filter((key) => key !== info.key)
          : [...currentSelectedKeys(), info.key]
        : [info.key],
      info,
    )
  }

  return { items, nodeItems, currentExpandKeys, currentSelectedKeys, getItemInfo, clickItem }
}
