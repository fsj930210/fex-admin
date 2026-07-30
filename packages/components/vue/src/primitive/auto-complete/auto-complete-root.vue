<script setup lang="ts">
import { createAutoCompleteController } from '@fex/components-core/auto-complete/create-auto-complete-controller'
import type { AutoCompleteChangeMeta, AutoCompleteFieldNames } from '@fex/components-core/auto-complete/types'
import { computed, provide, useId } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import PopoverRoot from '../popover/popover-root.vue'
import { autoCompleteKey } from './context'

type Item = Record<string, unknown>
defineOptions({ inheritAttrs: false })
const props = withDefaults(defineProps<{
  items?: readonly Item[]
  fieldNames?: Partial<AutoCompleteFieldNames<Item>>
  value?: string
  defaultValue?: string
  open?: boolean
  defaultOpen?: boolean
  filterOption?: boolean | ((keyword: string, item: Item) => boolean)
  loading?: boolean
  disabled?: boolean
  readOnly?: boolean
  closeOnSelect?: boolean
  loop?: boolean
}>(), { items: () => [], loading: false, disabled: false, readOnly: false })
const emit = defineEmits<{
  change: [value: string, meta: AutoCompleteChangeMeta<Item>]
  search: [value: string, meta: { reason: 'input' | 'clear'; previousValue: string }]
  select: [value: string, meta: { selectedItem: Item; selectedKey: string | number; previousValue: string }]
  clear: [meta: { previousValue: string }]
  openChange: [open: boolean, meta: { reason: string }]
}>()
const controller = createAutoCompleteController<Item>({
  get items() { return props.items },
  get fieldNames() { return props.fieldNames },
  get value() { return props.value },
  get defaultValue() { return props.defaultValue },
  get open() { return props.open },
  get defaultOpen() { return props.defaultOpen },
  get filterOption() { return props.filterOption },
  get closeOnSelect() { return props.closeOnSelect },
  get loop() { return props.loop },
  onChange: (value, meta) => emit('change', value, meta),
  onSearch: (value, meta) => emit('search', value, meta),
  onSelect: (value, meta) => emit('select', value, meta),
  onClear: (meta) => emit('clear', meta),
  onOpenChange: (open, meta) => emit('openChange', open, meta),
})
const snapshot = useCoreStore(controller)
provide(autoCompleteKey, {
  controller,
  snapshot,
  items: computed(() => {
    props.items
    snapshot.value.value
    return controller.getVisibleItems()
  }),
  loading: computed(() => props.loading),
  disabled: computed(() => props.disabled),
  readOnly: computed(() => props.readOnly),
  listId: `auto-complete-${useId()}`,
})
function syncOpen(open: boolean) {
  controller.setOpen(open, open ? 'programmatic' : 'outside')
}
</script>
<template><PopoverRoot v-bind="$attrs" :open="snapshot.open" :disabled="props.disabled" :trigger="[]" @open-change="syncOpen"><slot /></PopoverRoot></template>
