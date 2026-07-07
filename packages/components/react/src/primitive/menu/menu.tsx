import { createExpansionController } from '@fex/components-core/expansion/create-expansion-controller'
import type { ExpansionKey } from '@fex/components-core/expansion/types'
import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { flattenTree, type FlattenTreeNode } from '@fex/utils/tree'
import {
  createContext,
  type ComponentProps,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  use,
  useRef,
} from 'react'
import { useCoreStore } from '../../hooks/use-core-store'

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

type MenuContextValue = UseMenuReturn

const MenuContext = createContext<MenuContextValue | null>(null)

function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !('type' in item)
}

function getMenuItemChildren(item: MenuItem): readonly MenuItem[] | undefined {
  if (isMenuNodeItem(item) || item.type === 'group') {
    return item.children
  }

  return undefined
}

function getMenuItemKey(item: MenuItem) {
  if (isMenuNodeItem(item)) {
    return item.key
  }

  return item.key ?? item.type
}

function getNodeItems(items: readonly MenuItem[]): MenuNodeEntry[] {
  return flattenTree(items, {
    getKey: getMenuItemKey,
    getChildren: getMenuItemChildren,
  }).filter((entry): entry is MenuNodeEntry => isMenuNodeItem(entry.node))
}

function toSelectionValue(key: MenuKey): SelectionValue {
  return key
}

function toExpansionKey(key: MenuKey): ExpansionKey {
  return key
}

function keysFromSelection(values: readonly SelectionValue[]): MenuKey[] {
  return [...values]
}

function keysFromExpansion(values: readonly ExpansionKey[]): MenuKey[] {
  return [...values]
}

function toSelectionInput(keys: readonly MenuKey[] | undefined) {
  return keys === undefined ? undefined : [...keys]
}

type MenuRuntimeOptions = UseMenuOptions & {
  nodeItems: MenuNodeEntry[]
}

type MenuDataAttributes = Partial<Record<`data-${string}`, string | number | boolean | undefined>>
type MenuRootDomProps = ComponentProps<'div'> & MenuDataAttributes
type MenuListDomProps = ComponentProps<'div'> & MenuDataAttributes
type MenuSubMenuContentDomProps = ComponentProps<'div'> & MenuDataAttributes

function createEmptyMenuItemInfo(key: MenuKey): MenuRenderItemInfo {
  return {
    item: { key, label: key },
    key,
    level: 0,
    index: 0,
    selected: false,
    expanded: false,
    disabled: false,
    hasChildren: false,
  }
}

export function useMenu({
  items = [],
  expandKeys,
  defaultExpandKeys,
  expandMultiple = true,
  selectedKeys,
  defaultSelectedKeys,
  selectMultiple = false,
  selectable = true,
  disabled = false,
  onExpandChange,
  onSelect,
  onDeselect,
  onClick,
}: UseMenuOptions = {}) {
  const nodeItems = getNodeItems(items)
  const disabledKeys = disabled
    ? nodeItems.map((entry) => entry.key)
    : nodeItems.filter((entry) => entry.node.disabled).map((entry) => entry.key)

  const optionsRef = useRef<MenuRuntimeOptions>({
    items,
    expandKeys,
    defaultExpandKeys,
    expandMultiple,
    selectedKeys,
    defaultSelectedKeys,
    selectMultiple,
    selectable,
    disabled,
    nodeItems,
    onExpandChange,
    onSelect,
    onDeselect,
    onClick,
  })

  Object.assign(optionsRef.current, {
    items,
    expandKeys,
    defaultExpandKeys,
    expandMultiple,
    selectedKeys,
    defaultSelectedKeys,
    selectMultiple,
    selectable,
    disabled,
    nodeItems,
    onExpandChange,
    onSelect,
    onDeselect,
    onClick,
  })

  const expansionControllerRef = useRef<ReturnType<typeof createExpansionController> | null>(null)
  const selectionControllerRef = useRef<ReturnType<typeof createSelectionController> | null>(null)

  const getInfoByKey = (key: MenuKey): MenuRenderItemInfo => {
    const entry = optionsRef.current.nodeItems.find((item) => Object.is(item.key, key))
    if (!entry) {
      return createEmptyMenuItemInfo(key)
    }

    return createMenuRenderItemInfo(
      entry,
      expansionControllerRef.current?.isExpanded(entry.key) ?? false,
      selectionControllerRef.current?.isSelected(entry.key) ?? false,
      disabled || entry.node.disabled === true,
    )
  }

  const expansionOptionsRef = useRef({
    expandedKeys: expandKeys,
    defaultExpandedKeys: defaultExpandKeys,
    multiple: expandMultiple,
    disabledKeys,
    onChange: (keys: ExpansionKey[], meta: { previousKeys: ExpansionKey[] }) => {
      const changedKey = keys.find((key) => !meta.previousKeys.includes(key)) ?? meta.previousKeys.find((key) => !keys.includes(key))
      const info = getInfoByKey(changedKey ?? keys[0] ?? meta.previousKeys[0] ?? '')
      optionsRef.current.onExpandChange?.(keysFromExpansion(keys), {
        ...info,
        expandKeys: keysFromExpansion(keys),
        previousExpandKeys: keysFromExpansion(meta.previousKeys),
      })
    },
  })

  const selectionOptionsRef = useRef({
    value: toSelectionInput(selectedKeys),
    defaultValue: toSelectionInput(defaultSelectedKeys),
    multiple: selectMultiple,
    disabledValues: disabledKeys,
    onChange: (values: SelectionValue[], meta: { previousValues: SelectionValue[] }) => {
      const previousKeys = keysFromSelection(meta.previousValues)
      const nextKeys = keysFromSelection(values)
      const changedKey = nextKeys.find((key) => !previousKeys.includes(key)) ?? previousKeys.find((key) => !nextKeys.includes(key))
      const info = getInfoByKey(changedKey ?? nextKeys[0] ?? previousKeys[0] ?? '')
      const callbackInfo = {
        ...info,
        selectedKeys: nextKeys,
        previousSelectedKeys: previousKeys,
      }

      if (nextKeys.length >= previousKeys.length) {
        optionsRef.current.onSelect?.(nextKeys, callbackInfo)
        return
      }

      optionsRef.current.onDeselect?.(nextKeys, callbackInfo)
    },
  })

  Object.assign(expansionOptionsRef.current, {
    expandedKeys: expandKeys,
    defaultExpandedKeys: defaultExpandKeys,
    multiple: expandMultiple,
    disabledKeys,
  })
  Object.assign(selectionOptionsRef.current, {
    value: toSelectionInput(selectedKeys),
    defaultValue: toSelectionInput(defaultSelectedKeys),
    multiple: selectMultiple,
    disabledValues: disabledKeys,
  })

  expansionControllerRef.current ??= createExpansionController(expansionOptionsRef.current)
  selectionControllerRef.current ??= createSelectionController(selectionOptionsRef.current)

  const expansionSnapshot = useCoreStore(expansionControllerRef.current)
  const selectionSnapshot = useCoreStore(selectionControllerRef.current)

  const getItemInfo = (entry: MenuNodeEntry) =>
    createMenuRenderItemInfo(
      entry,
      expansionSnapshot.expandedKeys.includes(entry.key),
      selectionSnapshot.values.includes(entry.key),
      disabled || entry.node.disabled === true,
    )

  const menu: UseMenuReturn = {
    items,
    nodeItems,
    expandKeys: keysFromExpansion(expansionSnapshot.expandedKeys),
    selectedKeys: keysFromSelection(selectionSnapshot.values),
    getRootProps: (props = {}) => ({
      ...props,
      role: props.role ?? 'menu',
      'data-slot': 'menu',
      'data-disabled': disabled ? 'true' : undefined,
    }),
    getListProps: (props = {}) => ({
      ...props,
      role: props.role ?? 'group',
      'data-slot': 'menu-list',
    }),
    getItemInfo,
    getItemProps: (entry, props = {}, itemOptions = {}) => {
      const info = getItemInfo(entry)
      const itemHidden = itemOptions.hidden === true

      return {
        ...props,
        role: props.role ?? 'menuitem',
        tabIndex: info.disabled || itemHidden ? -1 : 0,
        'aria-disabled': info.disabled || undefined,
        'aria-expanded': info.hasChildren ? info.expanded : undefined,
        'data-slot': 'menu-item',
        'data-key': String(info.key),
        'data-level': info.level,
        'data-selected': info.selected ? 'true' : 'false',
        'data-expanded': info.expanded ? 'true' : 'false',
        'data-disabled': info.disabled ? 'true' : undefined,
        'data-has-children': info.hasChildren ? 'true' : 'false',
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
          props.onClick?.(event)
          if (event.defaultPrevented || itemHidden) {
            return
          }
          menu.clickItem(info, event)
        },
        onKeyDown: (event: KeyboardEvent<HTMLButtonElement>) => {
          props.onKeyDown?.(event)
          if (event.defaultPrevented || itemHidden || (event.key !== 'Enter' && event.key !== ' ')) {
            return
          }
          event.preventDefault()
          menu.clickItem(info, event)
        },
      }
    },
    getSubMenuContentProps: (entry, props = {}) => {
      const info = getItemInfo(entry)

      return {
        ...props,
        role: props.role ?? 'group',
        'data-slot': 'menu-submenu-content',
        'data-level': info.level + 1,
        'data-expanded': info.expanded ? 'true' : 'false',
      }
    },
    isExpanded: (key) => expansionControllerRef.current?.isExpanded(toExpansionKey(key)) ?? false,
    isSelected: (key) => selectionControllerRef.current?.isSelected(toSelectionValue(key)) ?? false,
    toggleExpand: (key) => expansionControllerRef.current?.toggle(toExpansionKey(key)),
    selectItem: (key) => {
      if (!selectable) {
        return
      }

      if (selectMultiple) {
        selectionControllerRef.current?.toggle(toSelectionValue(key))
        return
      }

      selectionControllerRef.current?.replace(toSelectionValue(key))
    },
    clickItem: (info, event) => {
      if (info.disabled) {
        return
      }

      optionsRef.current.onClick?.({ ...info, event })

      if (info.hasChildren) {
        expansionControllerRef.current?.toggle(toExpansionKey(info.key))
        return
      }

      menu.selectItem(info.key)
    },
  }

  return menu
}

function createMenuRenderItemInfo(
  entry: MenuNodeEntry,
  expanded: boolean,
  selected: boolean,
  disabled: boolean,
): MenuRenderItemInfo {
  const parent = entry.parent && isMenuNodeItem(entry.parent) ? entry.parent : undefined

  const info: MenuRenderItemInfo = {
    item: entry.node,
    key: entry.key,
    level: entry.level,
    index: entry.index,
    selected,
    expanded,
    disabled,
    hasChildren: entry.hasChildren,
  }

  if (parent !== undefined) {
    info.parent = parent
  }

  return info
}

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

export function useMenuContext(component: string) {
  const context = use(MenuContext)
  if (!context) {
    throw new Error(`${component} must be used inside MenuRoot.`)
  }

  return context
}

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

export type { FlattenTreeNode }
