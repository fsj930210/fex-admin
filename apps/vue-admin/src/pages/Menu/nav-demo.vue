<script setup lang="ts">
import { ChevronDownIcon } from '@fex-design/vue/icon/chevron'
import { DropdownContent } from '@fex-design/vue/primitive/dropdown'
import { MenuItem, MenuList, MenuRoot } from '@fex-design/vue/primitive/menu'
import { PopoverPortal, PopoverRoot, PopoverTrigger } from '@fex-design/vue/primitive/popover'
import { mergeProps } from 'vue'
import { navListClassName, navPanelClassName, navTriggerClassName } from './demo-styles'

const components = [
  ['Alert Dialog', 'A modal dialog that interrupts the user with important content.'],
  ['Hover Card', 'For sighted users to preview content behind a link.'],
  ['Progress', 'Displays an indicator showing completion progress.'],
  ['Scroll Area', 'Augments native scroll functionality for custom styling.'],
]
</script>

<template>
  <MenuRoot role="navigation" aria-label="Product navigation">
    <MenuList orientation="horizontal" :class="navListClassName">
      <MenuItem value="getting-started"><template #trigger="slot"><a v-bind="slot.props" :class="navTriggerClassName" href="#getting-started">Getting started</a></template></MenuItem>
      <PopoverRoot :trigger="['hover', 'click']" side="bottom" align="center">
        <PopoverTrigger v-slot="popover"><MenuItem value="components" submenu><template #trigger="slot"><button v-bind="mergeProps(slot.props, popover.props)" :ref="popover.ref" :class="navTriggerClassName"><span>Components</span><ChevronDownIcon class="size-3.5 shrink-0" /></button></template></MenuItem></PopoverTrigger>
        <PopoverPortal><DropdownContent :class="navPanelClassName"><MenuList orientation="vertical" parent-value="components" class="grid grid-cols-2 gap-1"><MenuItem v-for="item in components" :key="item[0]" :value="item[0]"><template #trigger="slot"><a v-bind="slot.props" :href="`#${item[0].toLowerCase().replace(' ', '-')}`" class="block rounded-md p-3 outline-none transition-colors hover:bg-muted-background focus-visible:bg-muted-background"><div class="text-sm font-medium">{{ item[0] }}</div><p class="mt-1 line-clamp-2 text-xs leading-5 text-muted-foreground">{{ item[1] }}</p></a></template></MenuItem></MenuList></DropdownContent></PopoverPortal>
      </PopoverRoot>
      <MenuItem value="documentation"><template #trigger="slot"><a v-bind="slot.props" :class="navTriggerClassName" href="#documentation">Documentation</a></template></MenuItem>
    </MenuList>
  </MenuRoot>
</template>
