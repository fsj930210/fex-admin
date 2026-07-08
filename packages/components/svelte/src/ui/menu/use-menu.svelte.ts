import {
  getMenuNodeEntries,
  normalizeMenuKeys,
  type MenuItem,
  type MenuKey,
  type MenuNodeEntry,
  type MenuRenderItemInfo,
} from '../../primitive/menu/menu'

export interface MenuStateOptions {
  items: MenuItem[]
  expandKeys?: MenuKey[] | undefined
  defaultExpandKeys?: MenuKey[] | undefined
  expandMultiple: boolean
  selectedKeys?: MenuKey[] | undefined
  defaultSelectedKeys?: MenuKey[] | undefined
  selectMultiple: boolean
  selectable: boolean
  disabled: boolean
  onExpandChange?: ((keys: MenuKey[], info: MenuRenderItemInfo) => void) | undefined
  onSelect?: ((keys: MenuKey[], info: MenuRenderItemInfo) => void) | undefined
}

export function useMenuState(options: () => MenuStateOptions) {
  let uncontrolledExpandKeys = $state<MenuKey[] | undefined>(undefined)
  let uncontrolledSelectedKeys = $state<MenuKey[] | undefined>(undefined)
  const nodeEntries = $derived(getMenuNodeEntries(options().items))
  const entryMap = $derived(new Map(nodeEntries.map((entry) => [entry.key, entry])))
  const currentExpandKeys = $derived(
    options().expandKeys ?? uncontrolledExpandKeys ?? normalizeMenuKeys(options().defaultExpandKeys, options().expandMultiple),
  )
  const currentSelectedKeys = $derived(
    options().selectedKeys ?? uncontrolledSelectedKeys ?? normalizeMenuKeys(options().defaultSelectedKeys, options().selectMultiple),
  )

  function getItemInfo(entry: MenuNodeEntry): MenuRenderItemInfo {
    return {
      item: entry.node,
      key: entry.key,
      level: entry.level,
      index: entry.index,
      selected: currentSelectedKeys.includes(entry.key),
      expanded: currentExpandKeys.includes(entry.key),
      disabled: options().disabled || entry.node.disabled === true,
      hasChildren: entry.hasChildren,
    }
  }

  function clickItem(info: MenuRenderItemInfo) {
    const currentOptions = options()
    if (info.disabled) return
    if (info.hasChildren) {
      const nextKeys = normalizeMenuKeys(
        info.expanded ? currentExpandKeys.filter((key) => key !== info.key) : [...currentExpandKeys, info.key],
        currentOptions.expandMultiple,
      )
      if (currentOptions.expandKeys === undefined) uncontrolledExpandKeys = nextKeys
      currentOptions.onExpandChange?.(nextKeys, info)
      return
    }
    if (!currentOptions.selectable) return
    const nextKeys = normalizeMenuKeys(
      currentOptions.selectMultiple
        ? info.selected
          ? currentSelectedKeys.filter((key) => key !== info.key)
          : [...currentSelectedKeys, info.key]
        : [info.key],
      currentOptions.selectMultiple,
    )
    if (currentOptions.selectedKeys === undefined) uncontrolledSelectedKeys = nextKeys
    currentOptions.onSelect?.(nextKeys, info)
  }

  return {
    get nodeEntries() {
      return nodeEntries
    },
    get entryMap() {
      return entryMap
    },
    getItemInfo,
    clickItem,
  }
}
