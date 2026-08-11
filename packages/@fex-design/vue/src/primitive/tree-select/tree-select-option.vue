<script setup lang="ts">
import type { TreeSelectItem } from '@fex-design/core/tree-select/types'
import { computed, inject } from 'vue'
import { treeSelectKey } from './context'
const props = withDefaults(defineProps<{ item: TreeSelectItem; toggle?: boolean; closeOnSelect?: boolean; clearSearchOnSelect?: boolean }>(), {
  toggle: undefined,
  closeOnSelect: undefined,
  clearSearchOnSelect: true,
})
const context = inject(treeSelectKey)
if (!context) throw new Error('TreeSelectOption must be used inside TreeSelectRoot.')
const treeSelect = context
treeSelect.controller.registerItem(props.item)
const selected = computed(() => { void treeSelect.snapshot.value; return treeSelect.controller.isSelected(props.item.value) })
function select() {
  if (props.item.disabled) return
  if (props.toggle ?? treeSelect.snapshot.value.multiple) treeSelect.controller.toggle(props.item)
  else treeSelect.controller.select(props.item)
  if (props.clearSearchOnSelect) treeSelect.setSearchValue('')
  const shouldClose = props.closeOnSelect ?? !(props.toggle ?? treeSelect.snapshot.value.multiple)
  if (shouldClose) treeSelect.closePanel()
}
</script>
<template><slot :selected="selected" :select="select" /></template>
