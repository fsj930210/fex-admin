<script setup lang="ts">
import { createSelectController } from '@fex/components-core/select/create-select-controller'
import { filterSelectOptions } from '@fex/components-core/select/filter-options'
import type {
  SelectFilterOption,
  SelectMode,
  SelectOption,
  SelectVirtualOptions,
} from '@fex/components-core/select/types'
import { createSelectionController } from '@fex/components-core/selection/create-selection-controller'
import type { SelectionValue } from '@fex/components-core/selection/types'
import { computed, provide, useId } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import PopoverRoot from '../popover/popover-root.vue'
import { selectKey } from './context'

interface SelectChangeMeta {
  selectedItem?: SelectOption | undefined
  selectedItems: SelectOption[]
  previousSelectedValues: SelectionValue[]
  changedValues: SelectionValue[]
}

const props = withDefaults(
  defineProps<{
    options?: readonly SelectOption[]
    value?: SelectionValue | SelectionValue[]
    defaultValue?: SelectionValue | SelectionValue[]
    multiple?: boolean
    mode?: SelectMode
    maxCount?: number
    disabled?: boolean
    clearable?: boolean
    loading?: boolean
    showSearch?: boolean
    filterOption?: SelectFilterOption
    open?: boolean | undefined
    defaultOpen?: boolean
    searchValue?: string
    defaultSearchValue?: string
    status?: 'error' | 'warning' | undefined
    virtual?: SelectVirtualOptions
  }>(),
  {
    options: () => [],
    disabled: false,
    clearable: false,
    loading: false,
    showSearch: false,
    open: undefined,
  },
)
const emit = defineEmits<{
  change: [value: SelectionValue | SelectionValue[] | undefined, meta: SelectChangeMeta]
  openChange: [open: boolean]
  search: [keyword: string]
  tagCreate: [value: string]
}>()
const isMultiple = computed(() => props.multiple === true || props.mode === 'tags')
const selection = createSelectionController({
  get value() {
    return props.value
  },
  get defaultValue() {
    return props.defaultValue
  },
  get multiple() {
    return isMultiple.value
  },
  get disabledValues() {
    return props.options.filter((option) => option.disabled).map((option) => option.value)
  },
  onChange(values, meta) {
    const selectedItems = values.map(
      (value) =>
        props.options.find((option) => option.value === value) ?? { value, label: String(value) },
    )
    const selectedItem =
      meta.changedValues
        .map(
          (value) =>
            props.options.find((option) => option.value === value) ?? {
              value,
              label: String(value),
            },
        )
        .find((item) => values.includes(item.value)) ?? selectedItems[0]
    emit('change', isMultiple.value ? values : values[0], {
      selectedItem,
      selectedItems,
      previousSelectedValues: [...meta.previousValues],
      changedValues: [...meta.changedValues],
    })
  },
})
let controller!: ReturnType<typeof createSelectController>
controller = createSelectController({
  selection,
  get options() {
    return filterSelectOptions(
      props.options,
      controller.getSnapshot().searchValue,
      props.filterOption,
    )
  },
  get multiple() {
    return isMultiple.value
  },
  get mode() {
    return props.mode
  },
  get maxCount() {
    return props.maxCount
  },
  get open() {
    return props.open
  },
  get defaultOpen() {
    return props.defaultOpen
  },
  get searchValue() {
    return props.searchValue
  },
  get defaultSearchValue() {
    return props.defaultSearchValue
  },
  onOpenChange: (open) => emit('openChange', open),
  onSearch: (keyword) => emit('search', keyword),
  onTagCreate(value) {
    emit('tagCreate', value)
  },
})
const snapshot = useCoreStore(controller)
const options = computed(() => props.options)
const visibleOptions = computed(() =>
  props.filterOption
    ? filterSelectOptions(props.options, snapshot.value.searchValue, props.filterOption)
    : props.options,
)
const selectedOptions = computed(() => {
  snapshot.value.selectedValues
  return selection
    .getSnapshot()
    .values.map(
      (value) =>
        props.options.find((option) => option.value === value) ?? { value, label: String(value) },
    )
})
provide(selectKey, {
  controller,
  snapshot,
  options,
  visibleOptions,
  selectedOptions,
  multiple: isMultiple,
  tags: computed(() => props.mode === 'tags'),
  showSearch: computed(() => props.showSearch || props.mode === 'tags'),
  disabled: computed(() => props.disabled),
  clearable: computed(() => props.clearable),
  loading: computed(() => props.loading),
  status: computed(() => props.status),
  virtual: computed(() => props.virtual),
  listId: `select-${useId()}`,
  removeValue(value) {
    selection.unselect(value)
  },
})
function syncOpen(open: boolean) {
  if (open) controller.open()
  else controller.close()
}
</script>
<template>
  <PopoverRoot :open="snapshot.open" @open-change="syncOpen"><slot /></PopoverRoot>
</template>
