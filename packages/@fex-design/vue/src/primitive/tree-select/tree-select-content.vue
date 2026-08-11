<script setup lang="ts">
import PopoverContent from '../popover/popover-content.vue'
import PopoverPortal from '../popover/popover-portal.vue'
</script>
<template><PopoverPortal><PopoverContent v-bind="$attrs"><slot /></PopoverContent></PopoverPortal></template>
