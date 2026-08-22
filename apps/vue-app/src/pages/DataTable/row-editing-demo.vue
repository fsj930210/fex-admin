<script setup lang="ts">
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import { InputControl, InputRoot } from '@fex-design/vue/primitive/input'
import Button from '@fex-design/vue/ui/button'
import { h, ref, type Component } from 'vue'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
type F = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataTableColumnMeta<F, Person>
}
const f: F = tableFeatures({ columnSizingFeature, columnMeta: {} })
const rows = ref(people6),
  draft = ref<Person | null>(null),
  R = InputRoot as Component,
  I = InputControl as Component,
  B = Button as Component
const edit = (field: 'name' | 'department' | 'status', row: Person, value: unknown) =>
  draft.value?.id === row.id
    ? h(R, { value: String(draft.value[field]) }, () =>
        h(I, {
          onInput: (event: Event) => {
            draft.value = { ...draft.value!, [field]: (event.target as HTMLInputElement).value }
          },
        }),
      )
    : String(value ?? '')
const columns: ColumnDef<F, Person>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    cell: ({ row, getValue }) => edit('name', row.original, getValue()),
  },
  {
    accessorKey: 'department',
    header: 'Department',
    cell: ({ row, getValue }) => edit('department', row.original, getValue()),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row, getValue }) => edit('status', row.original, getValue()),
  },
  {
    id: '__actions__',
    header: 'Actions',
    size: 180,
    cell: ({ row }) =>
      draft.value?.id === row.id
        ? h('span', { class: 'inline-flex gap-space-sm' }, [
            h(B, { size: 'sm', onClick: save }, () => 'Save'),
            h(
              B,
              { size: 'sm', variant: 'outline', onClick: () => (draft.value = null) },
              () => 'Cancel',
            ),
          ])
        : h(
            B,
            { size: 'sm', variant: 'outline', onClick: () => (draft.value = { ...row.original }) },
            () => 'Edit row',
          ),
  },
]
const table = useDataTable({ features: f, data: rows.value, columns, getRowId: (r) => r.id })
function save() {
  if (!draft.value) return
  rows.value = rows.value.map((row) => (row.id === draft.value!.id ? draft.value! : row))
  draft.value = null
  table.setDataTableOptions({ features: f, data: rows.value, columns, getRowId: (r) => r.id })
}
</script>
<template>
  <DemoSection
    title="Row editing"
    description="Edit row creates one application-owned draft. Save replaces that row in the caller data; Cancel discards the draft without touching the table data."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Draft, save and cancel</h3>
      <DataTable :table="table" /></section
  ></DemoSection>
</template>
