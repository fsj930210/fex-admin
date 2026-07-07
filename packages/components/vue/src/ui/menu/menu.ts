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
import { computed, defineComponent, h, type PropType, type VNodeChild } from 'vue'
import { type MenuGroupItem, type MenuItem, type MenuKey, type MenuNodeEntry, type MenuNodeItem, type MenuRenderItemInfo, useMenu } from '../../primitive/menu/menu'

function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !('type' in item)
}

function isMenuGroupItem(item: MenuItem): item is MenuGroupItem {
  return 'type' in item && item.type === 'group'
}

function ChevronRightIcon() {
  return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', 'aria-hidden': 'true' }, [
    h('path', { d: 'm9 18 6-6-6-6' }),
  ])
}

export const Menu = defineComponent({
  name: 'Menu',
  props: {
    items: { type: Array as PropType<MenuItem[]>, default: () => [] },
    expandKeys: Array as PropType<MenuRenderItemInfo['key'][] | undefined>,
    defaultExpandKeys: Array as PropType<MenuRenderItemInfo['key'][] | undefined>,
    expandMultiple: { type: Boolean, default: true },
    selectedKeys: Array as PropType<MenuRenderItemInfo['key'][] | undefined>,
    defaultSelectedKeys: Array as PropType<MenuRenderItemInfo['key'][] | undefined>,
    selectMultiple: { type: Boolean, default: false },
    selectable: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    orientation: { type: String as PropType<'vertical' | 'horizontal'>, default: 'vertical' },
    indent: { type: Number, default: 18 },
    renderSuffix: Function as PropType<(info: MenuRenderItemInfo) => VNodeChild>,
    renderItem: Function as PropType<(info: MenuRenderItemInfo) => VNodeChild>,
    renderExpandIcon: Function as PropType<(info: MenuRenderItemInfo) => VNodeChild>,
    class: Object as PropType<Record<string, string | undefined>>,
  },
  emits: ['expandChange', 'select'],
  setup(props, context) {
    const menu = useMenu({
      items: () => props.items,
      expandKeys: () => props.expandKeys,
      ...(props.defaultExpandKeys === undefined ? {} : { defaultExpandKeys: props.defaultExpandKeys }),
      expandMultiple: () => props.expandMultiple,
      selectedKeys: () => props.selectedKeys,
      ...(props.defaultSelectedKeys === undefined ? {} : { defaultSelectedKeys: props.defaultSelectedKeys }),
      selectMultiple: () => props.selectMultiple,
      selectable: () => props.selectable,
      disabled: () => props.disabled,
      onExpandChange: (keys, info) => context.emit('expandChange', keys, info),
      onSelect: (keys, info) => context.emit('select', keys, info),
    })
    const entryMap = computed(() => new Map(menu.nodeItems.value.map((entry) => [entry.key, entry])))

    function renderNode(entry: MenuNodeEntry, hidden: boolean): VNodeChild {
      const info = menu.getItemInfo(entry)
      const suffix = props.renderSuffix?.(info) ?? info.item.suffix
      return h('div', { key: String(info.key), 'data-slot': 'menu-node' }, [
        h(
          'button',
          {
            type: 'button',
            role: 'menuitem',
            tabindex: info.disabled || hidden ? -1 : 0,
            'aria-disabled': info.disabled || undefined,
            'aria-expanded': info.hasChildren ? info.expanded : undefined,
            'data-slot': 'menu-item',
            'data-selected': info.selected ? 'true' : 'false',
            'data-expanded': info.expanded ? 'true' : 'false',
            'data-disabled': info.disabled ? 'true' : undefined,
            class: cn(menuItemClassName({ orientation: props.orientation }), props.class?.item),
            style: props.orientation === 'vertical' ? { paddingLeft: `calc(var(--menu-item-padding-x) + ${info.level * props.indent}px)` } : undefined,
            onClick: () => {
              if (!hidden) menu.clickItem(info)
            },
            onKeydown: (event: KeyboardEvent) => {
              if (hidden || (event.key !== 'Enter' && event.key !== ' ')) return
              event.preventDefault()
              menu.clickItem(info)
            },
          },
          props.renderItem?.(info) ?? [
            info.item.icon ? h('span', { class: cn(menuItemIconClassName, props.class?.icon), 'data-slot': 'menu-item-icon' }, info.item.icon) : null,
            h('span', { class: cn(menuItemLabelClassName, props.class?.label), 'data-slot': 'menu-item-label' }, [info.item.label]),
            suffix ? h('span', { class: cn(menuItemSuffixClassName, props.class?.suffix), 'data-slot': 'menu-item-suffix' }, suffix) : null,
            info.hasChildren ? h('span', { class: cn(menuExpandIconClassName, props.class?.expandIcon), 'data-slot': 'menu-expand-icon', 'aria-hidden': 'true' }, props.renderExpandIcon?.(info) ?? ChevronRightIcon()) : null,
          ],
        ),
        info.hasChildren
          ? h('div', { class: cn(menuSubMenuContentClassName, props.class?.submenuContent), 'data-expanded': info.expanded ? 'true' : 'false', 'aria-hidden': info.expanded ? undefined : 'true' }, [
              h('div', { class: menuSubMenuInnerClassName }, renderItems(info.item.children ?? [], hidden || !info.expanded)),
            ])
          : null,
      ])
    }

    function renderItems(items: readonly MenuItem[], hidden = false): VNodeChild[] {
      return items.map((item, index) => {
        if (!isMenuNodeItem(item)) {
          if (!isMenuGroupItem(item)) return h('div', { key: item.key ?? `divider-${index}`, role: 'separator', class: cn(menuDividerClassName, props.class?.divider), 'data-slot': 'menu-divider' })
          return h('div', { key: item.key ?? `group-${index}`, role: 'group', class: cn(menuGroupClassName, props.class?.group), 'data-slot': 'menu-group' }, [
            item.label ? h('div', { class: cn(menuGroupLabelClassName, props.class?.groupLabel), 'data-slot': 'menu-group-label' }, [item.label]) : null,
            renderItems(item.children, hidden),
          ])
        }
        const entry = entryMap.value.get(item.key)
        return entry ? renderNode(entry, hidden) : null
      })
    }

    return () =>
      h('div', { role: 'menu', 'data-slot': 'menu', 'data-orientation': props.orientation, class: cn(menuRootClassName({}), props.class?.root) }, [
        h('div', { role: 'group', 'data-slot': 'menu-list', 'data-orientation': props.orientation, class: cn(menuListClassName({ orientation: props.orientation }), props.class?.list) }, renderItems(props.items)),
      ])
  },
})

export default Menu

export type { MenuItem, MenuKey, MenuRenderItemInfo }
