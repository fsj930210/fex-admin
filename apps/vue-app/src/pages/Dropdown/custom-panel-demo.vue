<script setup lang="ts">
import { DropdownContent, DropdownRoot, DropdownTrigger } from '@fex-design/vue/primitive/dropdown'
import { PopoverPortal } from '@fex-design/vue/primitive/popover'
import Checkbox from '@fex-design/vue/ui/checkbox'
import { triggerClassName } from './demo-classes'
</script>

<template><DropdownRoot><DropdownTrigger v-slot="slot"><button v-bind="slot.props" :ref="slot.ref" :class="triggerClassName">Filters</button></DropdownTrigger><PopoverPortal><DropdownContent role="dialog" class="p-3"><div class="w-64 space-y-3"><h3 class="text-sm font-medium">Quick filters</h3><p class="text-xs text-muted-foreground">Content can host an additional custom panel.</p><div class="flex items-center gap-2 text-sm"><Checkbox id="vue-filter-active" default-checked /><label for="vue-filter-active">Only active records</label></div><div class="flex items-center gap-2 text-sm"><Checkbox id="vue-filter-assigned" default-checked /><label for="vue-filter-assigned">Assigned to me</label></div></div></DropdownContent></PopoverPortal></DropdownRoot></template>
