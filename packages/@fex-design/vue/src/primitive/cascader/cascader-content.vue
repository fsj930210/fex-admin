<script setup lang="ts">
import { cascaderContentClassName } from '@fex-design/styles/cascader'
import { cn } from '@fex/utils'
import { computed } from 'vue'
import PopoverContent from '../popover/popover-content.vue'
import PopoverPortal from '../popover/popover-portal.vue'
import CascaderPanel from './cascader-panel.vue'
const props = defineProps<{ class?: string }>()
const className = computed(() => cn(cascaderContentClassName, props.class))
</script>
<template><PopoverPortal><PopoverContent :class="className"><slot><CascaderPanel /></slot></PopoverContent></PopoverPortal></template>
