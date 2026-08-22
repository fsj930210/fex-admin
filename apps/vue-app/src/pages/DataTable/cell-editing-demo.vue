<script setup lang="ts">
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/vue/primitive/data-table'
import { useDataTable } from '@fex-design/vue/composables/use-data-table'
import { InputControl, InputRoot } from '@fex-design/vue/primitive/input'
import Button from '@fex-design/vue/ui/button'
import { h, ref, type Component } from 'vue'
import { people6, type Person } from './data'
import DemoSection from './demo-section.vue'
type F = { columnMeta: DataTableColumnMeta<F, Person> }
const f: F = tableFeatures({ columnMeta: {} })
type Field = 'name' | 'status' | 'visits'
const rows = ref(people6)
const editing = ref<{ rowId: string; field: Field } | null>(null)
const R = InputRoot as Component,
  I = InputControl as Component,
  B = Button as Component
const columns: ColumnDef<F, Person>[] = (['name', 'status', 'visits'] as const).map((field) => ({
  accessorKey: field,
  header: field[0]!.toUpperCase() + field.slice(1),
  ...(field === 'visits' ? { meta: { align: 'right' as const } } : {}),
  cell: ({ row, getValue }) =>
    editing.value?.rowId === row.id && editing.value.field === field
      ? h(R, { defaultValue: String(getValue() ?? '') }, () =>
          h(I, {
            autofocus: true,
            type: 'text',
            onBlur: (event: FocusEvent) =>
              update(row.id, field, (event.target as HTMLInputElement).value),
            onKeydown: (event: KeyboardEvent) => {
              if (event.key === 'Enter') (event.target as HTMLInputElement).blur()
              if (event.key === 'Escape') editing.value = null
            },
          }),
        )
      : h(
          B,
          {
            size: 'sm',
            variant: 'ghost',
            class: 'h-auto w-full justify-start px-0 text-inherit',
            onClick: () => (editing.value = { rowId: row.id, field }),
          },
          () => String(getValue() ?? ''),
        ),
}))
const table = useDataTable({ features: f, data: rows.value, columns, getRowId: (r) => r.id })
function update(id: string, field: Field, value: string) {
  rows.value = rows.value.map((row) =>
    row.id === id
      ? ({ ...row, [field]: field === 'visits' ? Number(value) || 0 : value } as Person)
      : row,
  )
  editing.value = null
  table.setDataTableOptions({ features: f, data: rows.value, columns, getRowId: (r) => r.id })
}
</script>
<template>
  <DemoSection
    title="Cell editing"
    description="Editing belongs to application data, not a hidden table copy. Click a value, then press Enter or blur to commit; Escape cancels the current cell."
    ><section class="space-y-space-sm">
      <h3 class="text-sm font-medium text-foreground">Editable name, status and visits</h3>
      <DataTable :table="table" /></section
  ></DemoSection>
</template>
