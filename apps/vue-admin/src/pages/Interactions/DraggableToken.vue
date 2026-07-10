<script setup lang="ts">
import { useDraggable } from '@fex/components-vue/composables/use-draggable'
import { computed, type CSSProperties } from 'vue'
const props = defineProps<{ id: string, label: string, type: string }>()
const draggable = useDraggable({ id: props.id, type: props.type, data: { label: props.label } })
function setTarget(element: unknown) { draggable.setTarget(element instanceof HTMLElement ? element : null) }
const overlayStyle = computed<CSSProperties>(() => draggable.overlayStyle.value as CSSProperties)
</script>
<template>
  <div :ref="setTarget" class="flex min-h-11 cursor-grab touch-none select-none items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium shadow-sm transition-[opacity,box-shadow] hover:shadow-md active:cursor-grabbing data-[dragging=true]:opacity-35" :data-dragging="draggable.dragging.value || undefined"><span>{{ props.label }}</span><span class="text-muted-foreground">::</span></div>
  <Teleport to="body"><div v-if="draggable.dragging.value" class="flex min-h-11 items-center justify-between rounded-md border border-border bg-card px-space-md text-sm font-medium text-foreground opacity-100 shadow-xl ring-1 ring-border/70" :style="overlayStyle"><span>{{ props.label }}</span><span class="text-muted-foreground">::</span></div></Teleport>
</template>
