<script setup lang="ts">
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/vue/primitive/dropdown'
import { PopoverPortal } from '@fex-design/vue/primitive/popover'
import { triggerClassName } from './demo-classes'
import MenuAction from './menu-action.vue'
import MenuSurface from './menu-surface.vue'
</script>

<template>
  <DropdownRoot><DropdownTrigger v-slot="slot"><button v-bind="slot.props" :ref="slot.ref" :class="triggerClassName">Actions</button></DropdownTrigger><PopoverPortal><DropdownContent><MenuSurface><MenuAction>Edit</MenuAction><MenuAction>Duplicate</MenuAction><MenuAction>Archive</MenuAction></MenuSurface></DropdownContent></PopoverPortal></DropdownRoot>
</template>
