<script setup lang="ts" generic="TItem extends object">
import { createAutoCompleteController } from '@fex-design/core/auto-complete/create-auto-complete-controller'
import type {
  AutoCompleteChangeMeta,
  AutoCompleteFieldNames,
} from '@fex-design/core/auto-complete/types'
import { computed, provide, useId } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import PopoverRoot from '../popover/popover-root.vue'
import { autoCompleteKey } from './context'

defineOptions({ inheritAttrs: false })
const props = withDefaults(
  defineProps<{
    items?: readonly TItem[]
    fieldNames?: Partial<AutoCompleteFieldNames<TItem>>
    value?: string
    defaultValue?: string
    open?: boolean
    defaultOpen?: boolean
    filterOption?: boolean | ((keyword: string, item: TItem) => boolean)
    loading?: boolean
    disabled?: boolean
    readOnly?: boolean
    closeOnSelect?: boolean
    loop?: boolean
  }>(),
  { items: () => [], loading: false, disabled: false, readOnly: false },
)
const emit = defineEmits<{
  change: [value: string, meta: AutoCompleteChangeMeta<TItem>]
  search: [value: string, meta: { reason: 'input' | 'clear'; previousValue: string }]
  select: [
    value: string,
    meta: { selectedItem: TItem; selectedKey: string | number; previousValue: string },
  ]
  clear: [meta: { previousValue: string }]
  openChange: [open: boolean, meta: { reason: string }]
}>()
const controller = createAutoCompleteController<TItem>({
  get items() {
    return props.items
  },
  get fieldNames() {
    return props.fieldNames
  },
  get value() {
    return props.value
  },
  get defaultValue() {
    return props.defaultValue
  },
  get open() {
    return props.open
  },
  get defaultOpen() {
    return props.defaultOpen
  },
  get filterOption() {
    return props.filterOption
  },
  get closeOnSelect() {
    return props.closeOnSelect
  },
  get loop() {
    return props.loop
  },
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
    void props.items
    void snapshot.value.value
    return controller.getVisibleItems()
  }),
  loading: computed(() => props.loading),
  disabled: computed(() => props.disabled),
  readOnly: computed(() => props.readOnly),
  listId: `auto-complete-${useId()}`,
} as unknown as import('./context').AutoCompleteContext)
function syncOpen(open: boolean) {
  controller.setOpen(open, open ? 'programmatic' : 'outside')
}
</script>
<template>
  <PopoverRoot
    v-bind="$attrs"
    :open="snapshot.open"
    :disabled="props.disabled"
    :trigger="[]"
    @open-change="syncOpen"
    ><slot
  /></PopoverRoot>
</template>
