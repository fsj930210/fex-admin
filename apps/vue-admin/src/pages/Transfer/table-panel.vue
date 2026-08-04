<script setup lang="ts">
import { rowSelectionFeature } from '@fex-design/core/data-table/features/row-selection'
import {
  createDataTableSelectionColumn,
  DataTable,
  tableFeatures,
} from '@fex-design/vue/primitive/data-table'
import type { TransferPanelApi } from '@fex-design/vue/primitive/transfer'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import { watchEffect } from 'vue'
import type { Member } from './data'
const props = defineProps<{ api: TransferPanelApi<Member> }>()
const features = tableFeatures({ rowSelectionFeature })
const columns = [
  createDataTableSelectionColumn({ mode: 'multiple' }),
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'department', header: 'Department' },
]
const options = () => ({
  features,
  data: [...props.api.items],
  columns,
  getRowId: (row: Member) => row.id,
  enableRowSelection: (row: any) => row.original.disabled !== true,
  state: {
    rowSelection: Object.fromEntries(props.api.checkedKeys.map((key) => [String(key), true])),
  },
  onRowSelectionChange: (updater: any) => {
    const current = Object.fromEntries(props.api.checkedKeys.map((key) => [String(key), true]))
    const next = typeof updater === 'function' ? updater(current) : updater
    props.api.setCheckedKeys(Object.keys(next).filter((key) => next[key]))
  },
})
const table = useDataTable(options() as any)
watchEffect(() => table.setDataTableOptions(options() as any))
</script>
<template><DataTable :table="table" /></template>
