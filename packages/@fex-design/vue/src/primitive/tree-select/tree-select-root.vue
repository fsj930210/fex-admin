<script setup lang="ts">
import { createTreeSelectController } from '@fex-design/core/tree-select/create-tree-select-controller'
import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
import { computed, provide, ref, watchEffect } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import PopoverRoot from '../popover/popover-root.vue'
import { treeSelectKey } from './context'

const props = withDefaults(defineProps<{
  items?: readonly TreeSelectItem[] | undefined
  value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
  multiple?: boolean
  disabled?: boolean
  searchable?: boolean
  searchValue?: string | undefined
  defaultSearchValue?: string
  open?: boolean
  defaultOpen?: boolean
}>(), { multiple: false, disabled: false, searchable: false })
const emit = defineEmits<{
  change: [value: TreeSelectValue | TreeSelectValue[] | undefined, meta: unknown]
  searchValueChange: [value: string]
  openChange: [value: boolean, info: unknown]
}>()
const controller = createTreeSelectController({
  get items() { return props.items },
  get value() { return props.value },
  get defaultValue() { return props.defaultValue },
  get multiple() { return props.multiple },
  get disabled() { return props.disabled },
  onChange(value, meta) { emit('change', value, meta) },
})
const store = useCoreStore(controller)
const snapshot = computed(() => { void props.value; void props.multiple; void store.value; return controller.getSnapshot() })
const localSearchValue = ref(props.defaultSearchValue ?? '')
const localOpen = ref(props.defaultOpen ?? false)
const resolvedOpen = computed(() => props.open ?? localOpen.value)
const searchValue = computed({
  get: () => props.searchValue ?? localSearchValue.value,
  set: (value) => {
    if (props.searchValue === undefined) localSearchValue.value = value
    emit('searchValueChange', value)
  },
})
function requestOpen(value: boolean) {
  if (props.open === undefined) localOpen.value = value
  emit('openChange', value, { source: 'trigger' })
}
watchEffect(() => controller.updateOptions({
  items: props.items,
  value: props.value,
  multiple: props.multiple,
  disabled: props.disabled,
}))
provide(treeSelectKey, {
  controller,
  snapshot,
  searchable: computed(() => props.searchable),
  searchValue,
  setSearchValue: (value) => { searchValue.value = value },
  openPanel: () => requestOpen(true),
  closePanel: () => requestOpen(false),
  togglePanel: () => requestOpen(!resolvedOpen.value),
})
function handleOpenChange(value: boolean, info: unknown) { if (props.open === undefined) localOpen.value = value; emit('openChange', value, info) }
defineExpose({ controller, registerItem: (item: TreeSelectItem) => controller.registerItem(item) })
</script>
<template>
  <PopoverRoot :open="resolvedOpen" :disabled="disabled" @open-change="handleOpenChange">
    <slot :controller="controller" :state="snapshot" />
  </PopoverRoot>
</template>
