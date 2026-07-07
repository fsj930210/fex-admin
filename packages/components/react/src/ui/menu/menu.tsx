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
  type MenuRootStyleProps,
} from '@fex/components-styles/menu'
import { cn } from '@fex/utils'
import type { CSSProperties, ReactNode } from 'react'
import { ChevronRightIcon } from '../../icon/chevron'
import {
  type MenuItem,
  type MenuKey,
  type MenuNodeEntry,
  type MenuNodeItem,
  type MenuRenderItemInfo,
  type UseMenuOptions,
  useMenu,
} from '../../primitive/menu/menu'

type MenuClassName = {
  root?: string
  list?: string
  item?: string
  icon?: string
  label?: string
  suffix?: string
  expandIcon?: string
  submenuContent?: string
  group?: string
  groupLabel?: string
  divider?: string
}

type MenuStyle = {
  root?: CSSProperties
  item?: CSSProperties
}

export interface MenuProps extends UseMenuOptions, MenuRootStyleProps {
  orientation?: 'vertical' | 'horizontal'
  indent?: number
  renderItem?: (info: MenuRenderItemInfo) => ReactNode
  renderSuffix?: (info: MenuRenderItemInfo) => ReactNode
  renderExpandIcon?: (info: MenuRenderItemInfo) => ReactNode
  className?: MenuClassName
  style?: MenuStyle
}

function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !('type' in item)
}

export function Menu({
  items = [],
  orientation = 'vertical',
  indent = 18,
  renderItem,
  renderSuffix,
  renderExpandIcon,
  className,
  style,
  size,
  ...options
}: MenuProps) {
  const menu = useMenu({ ...options, items })
  const nodeEntryMap = new Map(menu.nodeItems.map((entry) => [entry.key, entry]))

  function renderMenuItems(menuItems: readonly MenuItem[], hidden = false) {
    return menuItems.map((item, index) => {
      if (!isMenuNodeItem(item)) {
        if (item.type === 'divider') {
          return (
            <div
              key={item.key ?? `divider-${index}`}
              role="separator"
              data-slot="menu-divider"
              className={cn(menuDividerClassName, className?.divider)}
            />
          )
        }

        return (
          <div
            key={item.key ?? `group-${index}`}
            role="group"
            data-slot="menu-group"
            className={cn(menuGroupClassName, className?.group)}
          >
            {item.label ? (
              <div
                data-slot="menu-group-label"
                className={cn(menuGroupLabelClassName, className?.groupLabel)}
              >
                {item.label}
              </div>
            ) : null}
            {renderMenuItems(item.children, hidden)}
          </div>
        )
      }

      const entry = nodeEntryMap.get(item.key)
      if (!entry) {
        return null
      }

      return renderNodeItem(entry, hidden)
    })
  }

  function renderNodeItem(entry: MenuNodeEntry, hidden: boolean) {
    const info = menu.getItemInfo(entry)
    const suffixNode = renderSuffix?.(info) ?? info.item.suffix
    const content = renderItem ? (
      renderItem(info)
    ) : (
      <>
        {info.item.icon ? (
          <span data-slot="menu-item-icon" className={cn(menuItemIconClassName, className?.icon)}>
            {info.item.icon}
          </span>
        ) : null}
        <span data-slot="menu-item-label" className={cn(menuItemLabelClassName, className?.label)}>
          {info.item.label}
        </span>
        {suffixNode !== undefined && suffixNode !== null && suffixNode !== false ? (
          <span
            data-slot="menu-item-suffix"
            className={cn(menuItemSuffixClassName, className?.suffix)}
          >
            {suffixNode}
          </span>
        ) : null}
        {info.hasChildren ? (
          <span
            aria-hidden="true"
            data-slot="menu-expand-icon"
            className={cn(menuExpandIconClassName, className?.expandIcon)}
          >
            {renderExpandIcon?.(info) ?? <ChevronRightIcon />}
          </span>
        ) : null}
      </>
    )

    return (
      <div key={info.key} data-slot="menu-node">
        <button
          {...menu.getItemProps(
            entry,
            {
              type: 'button',
              className: cn(menuItemClassName({ orientation }), className?.item),
              style: {
                paddingLeft:
                  orientation === 'vertical'
                    ? `calc(var(--menu-item-padding-x) + ${info.level * indent}px)`
                    : undefined,
                ...style?.item,
              },
            },
            { hidden },
          )}
        >
          {content}
        </button>
        {info.hasChildren ? (
          <div
            {...menu.getSubMenuContentProps(entry, {
              className: cn(menuSubMenuContentClassName, className?.submenuContent),
              'aria-hidden': info.expanded ? undefined : true,
            })}
          >
            <div className={menuSubMenuInnerClassName}>
              {renderMenuItems(info.item.children ?? [], hidden || !info.expanded)}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <div
      {...menu.getRootProps({
        className: cn(menuRootClassName({ size }), className?.root),
        style: style?.root,
        'data-orientation': orientation,
      })}
    >
      <div
        {...menu.getListProps({
          className: cn(menuListClassName({ orientation }), className?.list),
          'data-orientation': orientation,
        })}
      >
        {renderMenuItems(items)}
      </div>
    </div>
  )
}

export default Menu

export type { MenuItem, MenuKey, MenuNodeItem, MenuRenderItemInfo }
