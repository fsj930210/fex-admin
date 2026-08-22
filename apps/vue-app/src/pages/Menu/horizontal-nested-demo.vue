<script setup lang="ts">
import { ChevronDownIcon, ChevronRightIcon } from '@fex-design/vue/icon/chevron'
import { DropdownContent } from '@fex-design/vue/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/vue/primitive/menu'
import { PopoverPortal, PopoverRoot, PopoverTrigger } from '@fex-design/vue/primitive/popover'
import { mergeProps } from 'vue'
import {
  horizontalItemClassName,
  horizontalListClassName,
  popupClassName,
  rootClassName,
  verticalItemClassName,
  verticalListClassName,
} from './demo-styles'
</script>

<template>
  <MenuRoot role="navigation" aria-label="Nested navigation" :class="rootClassName">
    <MenuList orientation="horizontal" :class="horizontalListClassName">
      <MenuItem value="home" :class="horizontalItemClassName">Home</MenuItem>
      <PopoverRoot :trigger="['hover', 'click']" side="bottom" align="start">
        <PopoverTrigger v-slot="productsPopover">
          <MenuItem value="products" submenu>
            <template #trigger="slot"><button v-bind="mergeProps(slot.props, productsPopover.props)" :ref="productsPopover.ref" aria-haspopup="menu" :class="horizontalItemClassName"><span>Products</span><ChevronDownIcon class="size-3.5 shrink-0" /></button></template>
          </MenuItem>
        </PopoverTrigger>
        <PopoverPortal>
          <DropdownContent :class="popupClassName">
            <MenuList orientation="vertical" parent-value="products" :class="verticalListClassName">
              <MenuItem value="analytics" :class="verticalItemClassName">Analytics</MenuItem>
              <PopoverRoot :trigger="['hover', 'click']" side="right" align="start">
                <PopoverTrigger v-slot="platformPopover">
                  <MenuItem value="platform" submenu>
                    <template #trigger="slot"><button v-bind="mergeProps(slot.props, platformPopover.props)" :ref="platformPopover.ref" aria-haspopup="menu" :class="verticalItemClassName"><span class="flex-1 text-left">Platform</span><ChevronRightIcon class="size-4" /></button></template>
                  </MenuItem>
                </PopoverTrigger>
                <PopoverPortal><DropdownContent :class="popupClassName"><MenuList orientation="vertical" parent-value="platform" :class="verticalListClassName"><MenuItem value="api" :class="verticalItemClassName">API</MenuItem><MenuItem value="automation" :class="verticalItemClassName">Automation</MenuItem><MenuItem value="integrations" :class="verticalItemClassName">Integrations</MenuItem></MenuList></DropdownContent></PopoverPortal>
              </PopoverRoot>
              <MenuItem value="security" :class="verticalItemClassName">Security</MenuItem>
            </MenuList>
          </DropdownContent>
        </PopoverPortal>
      </PopoverRoot>
      <MenuItem value="pricing" :class="horizontalItemClassName">Pricing</MenuItem>
    </MenuList>
  </MenuRoot>
</template>
