<script setup lang="ts">
import { DropdownContent } from '@fex-design/vue/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/vue/primitive/menu'
import { PopoverPortal, PopoverRoot, PopoverTrigger } from '@fex-design/vue/primitive/popover'
import { mergeProps } from 'vue'
import {
  horizontalListClassName,
  popupClassName,
  verticalItemClassName,
  verticalListClassName,
  menubarClassName,
  menubarTriggerClassName,
} from './demo-styles'

const menus = [
  { name: 'File', items: ['New file', 'Open…', 'Save'] },
  { name: 'Edit', items: ['Undo', 'Redo', 'Find'] },
  { name: 'View', items: ['Zoom in', 'Zoom out', 'Full screen'] },
  { name: 'Profiles', items: ['Andy', 'Benoit', 'Add Profile…'] },
]
</script>

<template>
  <MenuRoot role="menubar" aria-label="Editor commands" :class="menubarClassName">
    <MenuList orientation="horizontal" :class="horizontalListClassName">
      <PopoverRoot v-for="menu in menus" :key="menu.name" :trigger="['click']" side="bottom" align="start">
        <PopoverTrigger v-slot="popover">
          <MenuItem :value="menu.name" submenu>
            <template #trigger="slot">
              <button v-bind="mergeProps(slot.props, popover.props)" :ref="popover.ref" aria-haspopup="menu" :class="menubarTriggerClassName">{{ menu.name }}</button>
            </template>
          </MenuItem>
        </PopoverTrigger>
        <PopoverPortal>
          <DropdownContent :class="popupClassName">
            <MenuList orientation="vertical" :parent-value="menu.name" :class="verticalListClassName">
              <MenuItem v-for="item in menu.items" :key="item" :value="`${menu.name}-${item}`" :class="verticalItemClassName">{{ item }}</MenuItem>
            </MenuList>
          </DropdownContent>
        </PopoverPortal>
      </PopoverRoot>
    </MenuList>
  </MenuRoot>
</template>
