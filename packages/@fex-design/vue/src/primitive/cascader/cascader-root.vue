<script setup lang="ts">
import { createCascaderController } from '@fex-design/core/cascader/create-cascader-controller'
import type { CascaderChangeMeta, CascaderFieldNames, CascaderFilterOption, CascaderOption, CascaderValue } from '@fex-design/core/cascader/types'
import { computed, provide } from 'vue'
import { useCoreStore } from '../../composables/use-core-store'
import PopoverRoot from '../popover/popover-root.vue'
import { cascaderKey } from './context'

const props = withDefaults(defineProps<{
  options?: readonly CascaderOption[]; fieldNames?: CascaderFieldNames; value?: CascaderValue; defaultValue?: CascaderValue
  multiple?: boolean; checkStrictly?: boolean; changeOnSelect?: boolean; open?: boolean; defaultOpen?: boolean
  expandTrigger?: 'click' | 'hover'; showSearch?: boolean; filterOption?: boolean | CascaderFilterOption
  loadData?: (path: readonly CascaderOption[]) => Promise<void>; clearable?: boolean; loading?: boolean; disabled?: boolean
  placeholder?: string; status?: 'error' | 'warning'; displayRender?: (labels: readonly string[], path: readonly CascaderOption[]) => unknown
}>(), { options: () => [], multiple: false, expandTrigger: 'click', showSearch: false, clearable: false, loading: false, disabled: false, open: undefined, filterOption: undefined })
const emit = defineEmits<{ change: [value: CascaderValue, meta: CascaderChangeMeta]; openChange: [open: boolean]; search: [keyword: string] }>()
const controller = createCascaderController({
  get options() { return props.options }, get fieldNames() { return props.fieldNames }, get value() { return props.value },
  get defaultValue() { return props.defaultValue }, get multiple() { return props.multiple }, get checkStrictly() { return props.checkStrictly },
  get changeOnSelect() { return props.changeOnSelect }, get open() { return props.open }, get defaultOpen() { return props.defaultOpen },
  get expandTrigger() { return props.expandTrigger }, get filterOption() { return props.filterOption },
  onChange: (value, meta) => emit('change', value, meta), onOpenChange: (open) => emit('openChange', open), onSearch: (value) => emit('search', value),
  get loadData() { return props.loadData },
})
const snapshot = useCoreStore(controller)
const selectedPaths = computed(() => { void snapshot.value.selectedPathKeys; return controller.getSelectedPaths() })
provide(cascaderKey, {
  controller, snapshot, selectedPaths, multiple: computed(() => props.multiple), expandTrigger: computed(() => props.expandTrigger),
  showSearch: computed(() => props.showSearch), clearable: computed(() => props.clearable), disabled: computed(() => props.disabled),
  loading: computed(() => props.loading), status: computed(() => props.status), placeholder: computed(() => props.placeholder), displayRender: props.displayRender,
})
function syncOpen(open: boolean) { open ? controller.open() : controller.close() }
</script>
<template><PopoverRoot align="start" :open="snapshot.open" :disabled="disabled" @open-change="syncOpen"><slot /></PopoverRoot></template>
