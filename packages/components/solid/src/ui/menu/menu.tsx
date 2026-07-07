import {
  menuDividerClassName,
  menuExpandIconClassName,
  menuGroupClassName,
  menuGroupLabelClassName,
  menuItemClassName,
  menuItemIconClassName,
  menuItemLabelClassName,
  menuItemSuffixClassName,
  menuListClassName,
  menuRootClassName,
  menuSubMenuContentClassName,
  menuSubMenuInnerClassName,
} from '@fex/components-styles/menu'
import { cn } from '@fex/utils'
import { For, type JSX } from 'solid-js'
import { createMenu, type MenuItem, type MenuKey, type MenuNodeEntry, type MenuRenderItemInfo } from '../../primitive/menu/menu'
import { ChevronRightIcon } from '../../icon/chevron'

export interface MenuProps {
  items?: readonly MenuItem[]
  expandKeys?: readonly MenuKey[]
  defaultExpandKeys?: readonly MenuKey[]
  expandMultiple?: boolean
  selectedKeys?: readonly MenuKey[]
  defaultSelectedKeys?: readonly MenuKey[]
  selectMultiple?: boolean
  selectable?: boolean
  disabled?: boolean
  orientation?: 'vertical' | 'horizontal'
  indent?: number
  class?: { root?: string; list?: string; item?: string; icon?: string; label?: string; suffix?: string; expandIcon?: string; submenuContent?: string; group?: string; groupLabel?: string; divider?: string }
  renderItem?: (info: MenuRenderItemInfo) => JSX.Element
  renderSuffix?: (info: MenuRenderItemInfo) => JSX.Element
  renderExpandIcon?: (info: MenuRenderItemInfo) => JSX.Element
  onExpandChange?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
  onSelect?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
}

function isMenuNodeItem(item: MenuItem): item is Extract<MenuItem, { key: MenuKey }> {
  return !('type' in item)
}

function isMenuGroupItem(item: MenuItem): item is Extract<MenuItem, { type: 'group' }> {
  return 'type' in item && item.type === 'group'
}

export function Menu(props: MenuProps) {
  const menu = createMenu({
    items: () => props.items ?? [],
    expandKeys: () => props.expandKeys,
    ...(props.defaultExpandKeys === undefined ? {} : { defaultExpandKeys: props.defaultExpandKeys }),
    expandMultiple: () => props.expandMultiple ?? true,
    selectedKeys: () => props.selectedKeys,
    ...(props.defaultSelectedKeys === undefined ? {} : { defaultSelectedKeys: props.defaultSelectedKeys }),
    selectMultiple: () => props.selectMultiple ?? false,
    selectable: () => props.selectable ?? true,
    disabled: () => props.disabled ?? false,
    ...(props.onExpandChange === undefined ? {} : { onExpandChange: props.onExpandChange }),
    ...(props.onSelect === undefined ? {} : { onSelect: props.onSelect }),
  })
  const entryMap = () => new Map(menu.nodeItems().map((entry) => [entry.key, entry]))

  function renderNode(entry: MenuNodeEntry, hidden: boolean) {
    const info = () => menu.getItemInfo(entry)
    const suffix = () => props.renderSuffix?.(info()) ?? info().item.suffix
    return (
      <div data-slot="menu-node">
        <button
          type="button"
          role="menuitem"
          tabIndex={info().disabled || hidden ? -1 : 0}
          aria-disabled={info().disabled || undefined}
          aria-expanded={info().hasChildren ? info().expanded : undefined}
          data-slot="menu-item"
          data-selected={info().selected ? 'true' : 'false'}
          data-expanded={info().expanded ? 'true' : 'false'}
          data-disabled={info().disabled ? 'true' : undefined}
          class={cn(menuItemClassName({ orientation: props.orientation ?? 'vertical' }), props.class?.item)}
          style={props.orientation === 'horizontal' ? undefined : { 'padding-left': `calc(var(--menu-item-padding-x) + ${info().level * (props.indent ?? 18)}px)` }}
          onClick={() => !hidden && menu.clickItem(info())}
          onKeyDown={(event) => {
            if (hidden || (event.key !== 'Enter' && event.key !== ' ')) return
            event.preventDefault()
            menu.clickItem(info())
          }}
        >
          {props.renderItem?.(info()) ?? (
            <>
              {info().item.icon ? <span class={cn(menuItemIconClassName, props.class?.icon)}>{info().item.icon}</span> : null}
              <span class={cn(menuItemLabelClassName, props.class?.label)}>{info().item.label}</span>
              {suffix() ? <span class={cn(menuItemSuffixClassName, props.class?.suffix)}>{suffix()}</span> : null}
              {info().hasChildren ? <span class={cn(menuExpandIconClassName, props.class?.expandIcon)}>{props.renderExpandIcon?.(info()) ?? <ChevronRightIcon />}</span> : null}
            </>
          )}
        </button>
        {info().hasChildren ? (
          <div class={cn(menuSubMenuContentClassName, props.class?.submenuContent)} data-expanded={info().expanded ? 'true' : 'false'} aria-hidden={info().expanded ? undefined : 'true'}>
            <div class={menuSubMenuInnerClassName}>{renderItems(info().item.children ?? [], hidden || !info().expanded)}</div>
          </div>
        ) : null}
      </div>
    )
  }

  function renderItems(items: readonly MenuItem[], hidden = false) {
    return (
      <For each={items}>
        {(item) => {
          if (!isMenuNodeItem(item)) {
            if (!isMenuGroupItem(item)) return <div role="separator" data-slot="menu-divider" class={cn(menuDividerClassName, props.class?.divider)} />
            return (
              <div role="group" data-slot="menu-group" class={cn(menuGroupClassName, props.class?.group)}>
                {item.label ? <div data-slot="menu-group-label" class={cn(menuGroupLabelClassName, props.class?.groupLabel)}>{item.label}</div> : null}
                {renderItems(item.children, hidden)}
              </div>
            )
          }
          const entry = entryMap().get(item.key)
          return entry ? renderNode(entry, hidden) : null
        }}
      </For>
    )
  }

  return (
    <div role="menu" data-slot="menu" data-orientation={props.orientation ?? 'vertical'} class={cn(menuRootClassName({}), props.class?.root)}>
      <div role="group" data-slot="menu-list" data-orientation={props.orientation ?? 'vertical'} class={cn(menuListClassName({ orientation: props.orientation ?? 'vertical' }), props.class?.list)}>
        {renderItems(props.items ?? [])}
      </div>
    </div>
  )
}

export default Menu
export type { MenuItem, MenuKey, MenuRenderItemInfo }
