import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { InputControl, InputRoot } from '@fex-design/solid/primitive/input'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { Button } from '@fex-design/solid/ui/button'
import { createSignal } from 'solid-js'
import { people6, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

type EditingFeatures = { columnMeta: DataTableColumnMeta<EditingFeatures, Person> }
const editingFeatures: EditingFeatures = tableFeatures({ columnMeta: {} })
type EditableField = 'name' | 'status' | 'visits'

export function CellEditingDataTableDemo() {
  const [rows, setRows] = createSignal(people6)
  const [editing, setEditing] = createSignal<{ rowId: string; field: EditableField } | null>(null)
  const columns: ColumnDef<EditingFeatures, Person>[] = (['name', 'status', 'visits'] as const).map(
    (field) => ({
      accessorKey: field,
      header: field[0]!.toUpperCase() + field.slice(1),
      ...(field === 'visits' ? { meta: { align: 'right' as const } } : {}),
      cell: ({ row, getValue }) =>
        editing()?.rowId === row.id && editing()?.field === field ? (
          <InputRoot value={String(getValue() ?? '')}>
            <InputControl
              autofocus
              type="text"
              value={String(getValue() ?? '')}
              aria-label={`Edit ${field} for ${row.id}`}
              onBlur={(event) => updateCell(row.id, field, event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
                if (event.key === 'Escape') setEditing(null)
              }}
            />
          </InputRoot>
        ) : (
          <Button
            size="sm"
            variant="ghost"
            class="h-auto w-full justify-start px-0 text-inherit"
            onClick={() => setEditing({ rowId: row.id, field })}
          >
            {String(getValue() ?? '')}
          </Button>
        ),
    }),
  )
  const table = createDataTable({
    features: editingFeatures,
    data: rows(),
    columns,
    getRowId: (row) => row.id,
  })
  function updateCell(rowId: string, field: EditableField, value: string) {
    const next = rows().map((row) =>
      row.id === rowId
        ? ({ ...row, [field]: field === 'visits' ? Number(value) || 0 : value } as Person)
        : row,
    )
    setRows(next)
    setEditing(null)
    table.setDataTableOptions({
      features: editingFeatures,
      data: next,
      columns,
      getRowId: (row) => row.id,
    })
  }
  return (
    <DataTableDemoSection
      title="Cell editing"
      description="Editing belongs to application data, not a hidden table copy. Click a value, then press Enter or blur to commit; Escape cancels the current cell."
    >
      <DemoBranch title="Editable name, status and visits">
        <DataTable table={table} />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
