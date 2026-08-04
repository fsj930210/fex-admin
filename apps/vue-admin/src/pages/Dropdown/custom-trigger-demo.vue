<script setup lang="ts">
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/vue/primitive/dropdown'
import { PopoverPortal } from '@fex-design/vue/primitive/popover'
import MenuAction from './menu-action.vue'
import MenuSurface from './menu-surface.vue'
</script>

<template><DropdownRoot><DropdownTrigger v-slot="slot"><button v-bind="slot.props" :ref="slot.ref" class="grid size-10 place-items-center rounded-full bg-primary text-primary-foreground" aria-label="Open account menu">FX</button></DropdownTrigger><PopoverPortal><DropdownContent><MenuSurface><MenuAction>Profile</MenuAction><MenuAction>Preferences</MenuAction><MenuAction>Sign out</MenuAction></MenuSurface></DropdownContent></PopoverPortal></DropdownRoot></template>
