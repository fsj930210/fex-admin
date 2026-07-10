<script setup lang="ts">
import type { SortableAxis, SortableItems } from '@fex/components-core/sortable/types'
import { sortableClassName } from '@fex/components-styles/sortable'
import { cn } from '@fex/utils'
import { provide, useAttrs } from 'vue'
import { useSortable, type UseSortableOptions } from '../../composables/use-sortable'
import { sortableContextKey } from './context'
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{ items: SortableItems, axis?: SortableAxis, containerId?: string, class?: string }>(), { containerId: 'default' })
const emit = defineEmits<{ change: [items: SortableItems] }>()
const attrs = useAttrs()
const createOptions = (): UseSortableOptions<SortableItems> => ({ items: props.items, ...(props.axis === undefined ? {} : { axis: props.axis }), onChange: (items) => emit('change', items) })
const sortable = useSortable(createOptions())
const syncOptions = () => sortable.update(createOptions())
provide(sortableContextKey, { sortable, syncOptions })
</script>
<template><div v-bind="attrs" :ref="sortable.setContainerRef(props.containerId)" :class="cn(sortableClassName, props.class)" :data-sortable-container="props.containerId"><slot :items="sortable.previewItems.value" :sortable="sortable" /></div></template>
