<script setup lang="ts">
import { menuDividerClassName, menuExpandIconClassName, menuGroupClassName, menuGroupLabelClassName, menuItemClassName, menuItemIconClassName, menuItemLabelClassName, menuItemSuffixClassName, menuSubMenuContentClassName, menuSubMenuInnerClassName } from '@fex/components-styles/menu'
import { cn } from '@fex/utils'
import { ChevronRightIcon } from '../../icon/chevron'
import type { MenuItem, MenuNodeItem, MenuRenderItemInfo } from '../../primitive/menu/menu-types'
import { isMenuGroupItem, isMenuNodeItem, useMenuUiContext } from './context'
defineOptions({ name: 'MenuItems' })
const props = withDefaults(defineProps<{ hidden?: boolean, items: readonly MenuItem[] }>(), { hidden: false })
const context = useMenuUiContext()
function nodeItem(item: MenuItem): MenuNodeItem | undefined { return isMenuNodeItem(item) ? item : undefined }
function itemInfo(item: MenuItem) { const node = nodeItem(item); if (!node) return undefined; const entry = context.entryMap().get(node.key); return entry ? context.menu.getItemInfo(entry) : undefined }
function itemStyle(info: MenuRenderItemInfo) { return context.orientation === 'vertical' ? { paddingLeft: `calc(var(--menu-item-padding-x) + ${info.level * context.indent}px)` } : undefined }
function activate(info: MenuRenderItemInfo) { if (!props.hidden) context.menu.clickItem(info) }
function handleKeydown(event: KeyboardEvent, info: MenuRenderItemInfo) { if (!props.hidden && (event.key === 'Enter' || event.key === ' ')) { event.preventDefault(); context.menu.clickItem(info) } }
</script>

<template>
  <template v-for="(item, index) in props.items" :key="'key' in item && item.key !== undefined ? item.key : index">
    <template v-if="isMenuNodeItem(item)">
      <div v-if="itemInfo(item)" data-slot="menu-node">
        <button
          type="button" role="menuitem" :tabindex="itemInfo(item)!.disabled || props.hidden ? -1 : 0"
          :aria-disabled="itemInfo(item)!.disabled || undefined" :aria-expanded="itemInfo(item)!.hasChildren ? itemInfo(item)!.expanded : undefined"
          data-slot="menu-item" :data-selected="itemInfo(item)!.selected ? 'true' : 'false'" :data-expanded="itemInfo(item)!.expanded ? 'true' : 'false'" :data-disabled="itemInfo(item)!.disabled ? 'true' : undefined"
          :class="cn(menuItemClassName({ orientation: context.orientation }), context.classNames?.item)" :style="itemStyle(itemInfo(item)!)"
          @click="activate(itemInfo(item)!)" @keydown="handleKeydown($event, itemInfo(item)!)"
        >
          <slot name="item" :info="itemInfo(item)!">
            <span v-if="nodeItem(item)!.icon" data-slot="menu-item-icon" :class="cn(menuItemIconClassName, context.classNames?.icon)">{{ nodeItem(item)!.icon }}</span>
            <span data-slot="menu-item-label" :class="cn(menuItemLabelClassName, context.classNames?.label)">{{ nodeItem(item)!.label }}</span>
            <span v-if="nodeItem(item)!.suffix" data-slot="menu-item-suffix" :class="cn(menuItemSuffixClassName, context.classNames?.suffix)"><slot name="suffix" :info="itemInfo(item)!">{{ nodeItem(item)!.suffix }}</slot></span>
            <span v-if="itemInfo(item)!.hasChildren" data-slot="menu-expand-icon" aria-hidden="true" :class="cn(menuExpandIconClassName, context.classNames?.expandIcon)"><slot name="expand-icon" :info="itemInfo(item)!"><ChevronRightIcon /></slot></span>
          </slot>
        </button>
        <div v-if="itemInfo(item)!.hasChildren" :class="cn(menuSubMenuContentClassName, context.classNames?.submenuContent)" :data-expanded="itemInfo(item)!.expanded ? 'true' : 'false'" :aria-hidden="itemInfo(item)!.expanded ? undefined : 'true'">
          <div :class="menuSubMenuInnerClassName"><MenuItems :items="nodeItem(item)!.children ?? []" :hidden="props.hidden || !itemInfo(item)!.expanded" /></div>
        </div>
      </div>
    </template>
    <div v-else-if="isMenuGroupItem(item)" role="group" data-slot="menu-group" :class="cn(menuGroupClassName, context.classNames?.group)">
      <div v-if="item.label" data-slot="menu-group-label" :class="cn(menuGroupLabelClassName, context.classNames?.groupLabel)">{{ item.label }}</div>
      <MenuItems :items="item.children" :hidden="props.hidden" />
    </div>
    <div v-else role="separator" data-slot="menu-divider" :class="cn(menuDividerClassName, context.classNames?.divider)" />
  </template>
</template>
