<script setup lang="ts">
import { useDroppable } from '@fex/components-vue/composables/use-droppable'
import DraggableToken from './DraggableToken.vue'
const props = defineProps<{ accept?: string, id: string, items: Array<{ id: string, label: string, type: string }>, title: string }>()
const emit = defineEmits<{ changed: [message: string], dropped: [source: Record<string, unknown>, edge: string | null] }>()
const droppable = useDroppable({
  id: props.id, edges: ['top', 'bottom'],
  onDragEnter: ({ source }) => emit('changed', `${String(source.id)} is over ${props.title}.`),
  onDragLeave: () => emit('changed', 'Drop a draggable item into a zone.'),
  onDrop: ({ source, edge }) => emit('dropped', source, edge),
  ...(props.accept ? { accept: props.accept } : {}),
})
</script>
<template><div :ref="(element) => droppable.setTarget(element as HTMLElement | null)" v-bind="droppable.dataAttributes.value" class="flex min-h-36 flex-col justify-between rounded-md border border-dashed border-border bg-background p-space-md text-sm transition-colors data-[can-drop=true]:border-ring data-[over=true]:bg-accent-background"><div><p class="font-medium text-foreground">{{ props.title }}</p><p class="mt-space-sm text-muted-foreground">{{ droppable.over.value ? droppable.canDrop.value ? 'Release to drop.' : 'This item is not accepted.' : 'Drop target' }}</p><div class="mt-space-md space-y-space-sm"><DraggableToken v-for="item in props.items" :key="item.id" v-bind="item" /></div></div><p class="text-xs text-muted-foreground">{{ droppable.edge.value ? `Closest edge: ${droppable.edge.value}` : props.accept ? `Accepts: ${props.accept}` : 'Accepts all' }}</p></div></template>
