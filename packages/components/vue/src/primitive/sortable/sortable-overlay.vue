<script setup lang="ts">
import { sortableItemClassName } from '@fex/components-styles/sortable'
import { cn } from '@fex/utils'
import { useAttrs } from 'vue'
import { useSortableContext } from './context'
defineOptions({ inheritAttrs: false })
const props = defineProps<{ class?: string }>()
const attrs = useAttrs()
const { sortable } = useSortableContext()
</script>
<template><Teleport to="body"><div v-if="sortable.snapshot.value.activeId" v-bind="attrs" data-sortable-overlay="" :class="cn(sortableItemClassName, 'bg-card text-foreground opacity-100 shadow-xl ring-1 ring-border/70', props.class)" :style="sortable.getOverlayStyle()"><slot :active-id="sortable.snapshot.value.activeId" :style="sortable.getOverlayStyle()" /></div></Teleport></template>
