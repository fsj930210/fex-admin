<script setup lang="ts">
import { menuListClassName, menuRootClassName } from '@fex/components-styles/menu'
import { cn } from '@fex/utils'
import { computed, provide } from 'vue'
import type { MenuItem, MenuKey, MenuRenderItemInfo } from '../../primitive/menu/menu-types'
import { useMenu } from '../../primitive/menu/use-menu'
import { menuUiContextKey } from './context'
import MenuItems from './menu-items.vue'

const props = withDefaults(defineProps<{
  class?: Record<string, string | undefined>
  defaultExpandKeys?: MenuKey[]
  defaultSelectedKeys?: MenuKey[]
  disabled?: boolean
  expandKeys?: MenuKey[]
  expandMultiple?: boolean
  indent?: number
  items?: MenuItem[]
  orientation?: 'vertical' | 'horizontal'
  selectMultiple?: boolean
  selectable?: boolean
  selectedKeys?: MenuKey[]
}>(), { disabled: false, expandMultiple: true, indent: 18, items: () => [], orientation: 'vertical', selectMultiple: false, selectable: true })
const emit = defineEmits<{ expandChange: [keys: MenuKey[], info: MenuRenderItemInfo], select: [keys: MenuKey[], info: MenuRenderItemInfo] }>()
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
  onExpandChange: (keys, info) => emit('expandChange', keys, info),
  onSelect: (keys, info) => emit('select', keys, info),
})
const entryMap = computed(() => new Map(menu.nodeItems.value.map((entry) => [entry.key, entry])))
provide(menuUiContextKey, { classNames: props.class, entryMap: () => entryMap.value, indent: props.indent, menu, orientation: props.orientation })
</script>

<template>
  <div role="menu" data-slot="menu" :data-orientation="props.orientation" :class="cn(menuRootClassName({}), props.class?.root)">
    <div role="group" data-slot="menu-list" :data-orientation="props.orientation" :class="cn(menuListClassName({ orientation: props.orientation }), props.class?.list)">
      <MenuItems :items="props.items">
        <template v-if="$slots.item" #item="{ info }"><slot name="item" :info="info" /></template>
        <template v-if="$slots.suffix" #suffix="{ info }"><slot name="suffix" :info="info" /></template>
        <template v-if="$slots['expand-icon']" #expand-icon="{ info }"><slot name="expand-icon" :info="info" /></template>
      </MenuItems>
    </div>
  </div>
</template>
