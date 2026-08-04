<script setup lang="ts">
import { ChevronRightIcon } from '@fex-design/vue/icon/chevron'
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/vue/primitive/dropdown'
import { PopoverPortal, PopoverRoot, PopoverTrigger } from '@fex-design/vue/primitive/popover'
import { triggerClassName } from './demo-classes'
import MenuAction from './menu-action.vue'
import MenuSurface from './menu-surface.vue'
</script>

<template>
  <DropdownRoot :trigger="['hover']"><DropdownTrigger v-slot="slot"><button v-bind="slot.props" :ref="slot.ref" :class="triggerClassName">File</button></DropdownTrigger><PopoverPortal><DropdownContent><MenuSurface><MenuAction>New</MenuAction>
    <PopoverRoot :trigger="['hover']" side="right" align="start" :side-offset="6">
      <PopoverTrigger v-slot="slot"><MenuAction v-bind="slot.props" :ref="slot.ref">Export <ChevronRightIcon class="size-4" /></MenuAction></PopoverTrigger>
      <PopoverPortal><DropdownContent><MenuSurface><MenuAction>PDF</MenuAction><MenuAction>Spreadsheet</MenuAction>
        <PopoverRoot :trigger="['hover']" side="right" align="start" :side-offset="6">
          <PopoverTrigger v-slot="slot"><MenuAction v-bind="slot.props" :ref="slot.ref">More formats <ChevronRightIcon class="size-4" /></MenuAction></PopoverTrigger>
          <PopoverPortal><DropdownContent><MenuSurface><MenuAction>CSV</MenuAction><MenuAction>JSON</MenuAction></MenuSurface></DropdownContent></PopoverPortal>
        </PopoverRoot>
      </MenuSurface></DropdownContent></PopoverPortal>
    </PopoverRoot>
  </MenuSurface></DropdownContent></PopoverPortal></DropdownRoot>
</template>
