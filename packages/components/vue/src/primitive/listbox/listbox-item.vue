<script setup lang="ts">
import type { SelectionValue } from '@fex/components-core/selection/types'
import { computed } from 'vue'
import { useListboxContext } from './context'
const props = withDefaults(defineProps<{ value: SelectionValue, disabled?: boolean }>(), { disabled: false })
const emit = defineEmits<{ select: [value: SelectionValue] }>()
const context = useListboxContext('ListboxItem')
const selected = computed(() => context.selectedValues.value.includes(props.value))
const itemDisabled = computed(() => props.disabled || context.isDisabled(props.value))
function select() { if (!itemDisabled.value) { context.selectItem(props.value); emit('select', props.value) } }
function handleKeydown(event: KeyboardEvent) { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); select() } }
</script>
<template><div v-bind="$attrs" role="option" :tabindex="itemDisabled ? undefined : 0" :aria-selected="selected" :aria-disabled="itemDisabled || undefined" data-slot="listbox-item" :data-selected="selected ? 'true' : 'false'" :data-disabled="itemDisabled ? 'true' : undefined" @click="select" @keydown="handleKeydown"><slot /></div></template>
