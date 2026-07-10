<script setup lang="ts">
import type { SortableId } from '@fex/components-core/sortable/types'
import { sortableItemClassName } from '@fex/components-styles/sortable'
import { cn } from '@fex/utils'
import { computed, useAttrs } from 'vue'
import { useSortableContext } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ id: SortableId, containerId?: string, class?: string }>(), { containerId: 'default' })
const attrs = useAttrs()
const { sortable, syncOptions } = useSortableContext()
const active = computed(() => sortable.snapshot.value.activeId === props.id)
function handlePointerdown(event: PointerEvent) { syncOptions(); sortable.onItemPointerDown(event, props.id, props.containerId) }
</script>
<template><div v-bind="attrs" :ref="sortable.setItemRef(props.id, props.containerId)" :class="cn(sortableItemClassName, props.class)" :style="sortable.getItemStyle(props.id)" :data-active="active || undefined" :data-sortable-id="props.id" :data-sortable-container-id="props.containerId" @pointerdown="handlePointerdown"><slot :active="active" :sortable="sortable" /></div></template>
