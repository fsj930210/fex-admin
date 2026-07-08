import { flattenTree } from '@fex/utils/tree'
import { computed, ref } from 'vue'
import type { MenuItem, MenuKey, MenuNodeEntry, MenuNodeItem, MenuRenderItemInfo } from './menu-types'

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

export function useMenu(options: {
  items?: () => readonly MenuItem[]
  expandKeys?: () => readonly MenuKey[] | undefined
  defaultExpandKeys?: readonly MenuKey[]
  expandMultiple?: () => boolean
  selectedKeys?: () => readonly MenuKey[] | undefined
  defaultSelectedKeys?: readonly MenuKey[]
  selectMultiple?: () => boolean
  selectable?: () => boolean
  disabled?: () => boolean
  onExpandChange?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
  onSelect?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
}) {
  const uncontrolledExpandKeys = ref<MenuKey[]>(normalizeKeys(options.defaultExpandKeys, options.expandMultiple?.() ?? true))
  const uncontrolledSelectedKeys = ref<MenuKey[]>(normalizeKeys(options.defaultSelectedKeys, options.selectMultiple?.() ?? false))
  const items = computed(() => options.items?.() ?? [])
  const nodeItems = computed(() =>
    flattenTree(items.value, { getKey: getMenuItemKey, getChildren: getMenuItemChildren }).filter(
      (entry): entry is MenuNodeEntry => isMenuNodeItem(entry.node),
    ),
  )
  const currentExpandKeys = computed(() => [...(options.expandKeys?.() ?? uncontrolledExpandKeys.value)])
  const currentSelectedKeys = computed(() => [...(options.selectedKeys?.() ?? uncontrolledSelectedKeys.value)])

  function getItemInfo(entry: MenuNodeEntry): MenuRenderItemInfo {
    return {
      item: entry.node,
      key: entry.key,
      level: entry.level,
      index: entry.index,
      selected: currentSelectedKeys.value.includes(entry.key),
      expanded: currentExpandKeys.value.includes(entry.key),
      disabled: options.disabled?.() === true || entry.node.disabled === true,
      hasChildren: entry.hasChildren,
    }
  }

  function setExpandKeys(keys: MenuKey[], info: MenuRenderItemInfo) {
    const normalized = normalizeKeys(keys, options.expandMultiple?.() ?? true)
    if (options.expandKeys?.() === undefined) uncontrolledExpandKeys.value = normalized
    options.onExpandChange?.(normalized, info)
  }

  function setSelectedKeys(keys: MenuKey[], info: MenuRenderItemInfo) {
    const normalized = normalizeKeys(keys, options.selectMultiple?.() ?? false)
    if (options.selectedKeys?.() === undefined) uncontrolledSelectedKeys.value = normalized
    options.onSelect?.(normalized, info)
  }

  function clickItem(info: MenuRenderItemInfo) {
    if (info.disabled) return
    if (info.hasChildren) {
      const nextKeys = info.expanded
        ? currentExpandKeys.value.filter((key) => key !== info.key)
        : [...currentExpandKeys.value, info.key]
      setExpandKeys(nextKeys, info)
      return
    }
    if (options.selectable?.() === false) return
    const nextKeys = options.selectMultiple?.() === true
      ? info.selected
        ? currentSelectedKeys.value.filter((key) => key !== info.key)
        : [...currentSelectedKeys.value, info.key]
      : [info.key]
    setSelectedKeys(nextKeys, info)
  }

  return { items, nodeItems, currentExpandKeys, currentSelectedKeys, getItemInfo, clickItem }
}
