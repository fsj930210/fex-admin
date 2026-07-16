<script setup lang="ts">
import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { computed, provide } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import { listboxContextKey, type ListboxOrientation } from './context'

const props = withDefaults(defineProps<{
  defaultValue?: SelectionValue | SelectionValue[]
  disabled?: boolean
  getItemDisabled?: (item: unknown) => boolean
  getItemValue?: (item: unknown) => SelectionValue
  items?: readonly unknown[]
  multiple?: boolean
  orientation?: ListboxOrientation
  value?: SelectionValue | SelectionValue[]
}>(), { disabled: false, items: () => [], multiple: false, orientation: 'vertical' })
const emit = defineEmits<{ change: [value: SelectionValue | SelectionValue[] | undefined, meta: Record<string, unknown>] }>()

function itemValue(item: unknown) { return props.getItemValue ? props.getItemValue(item) : (item as { value: SelectionValue }).value }
function optionMap() { return new Map(props.items.map((item) => [itemValue(item), item])) }
function disabledValues() {
  return props.items.filter((item) => props.disabled || props.getItemDisabled?.(item) || (item as { disabled?: boolean }).disabled).map(itemValue)
}
const controller = createSelectionController({
  get value() { return props.value }, get defaultValue() { return props.defaultValue }, get multiple() { return props.multiple }, get disabledValues() { return disabledValues() },
  onChange(values, meta) {
    const map = optionMap()
    const selectedItems = values.map((value) => map.get(value)).filter((item) => item !== undefined)
    emit('change', props.multiple ? values : values[0], { selectedItem: selectedItems[0], selectedItems, selectedValues: values, previousSelectedValues: meta.previousValues, changedValues: meta.changedValues })
  },
})
const storeSnapshot = useCoreStore(controller)
const selectedValues = computed(() => { void props.value; void props.multiple; void storeSnapshot.value; return controller.getSnapshot().values })
provide(listboxContextKey, {
  orientation: () => props.orientation,
  selectedValues,
  isDisabled: controller.isDisabled,
  selectItem(value) {
    if (controller.getSnapshot().multiple) controller.toggle(value)
    else controller.replace(value)
  },
})
</script>
<template><div v-bind="$attrs" role="listbox" :aria-multiselectable="controller.getSnapshot().multiple || undefined" :aria-orientation="props.orientation" :data-orientation="props.orientation" data-slot="listbox"><slot /></div></template>
