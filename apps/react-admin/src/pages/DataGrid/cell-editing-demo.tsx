/* oxlint-disable react/no-unstable-nested-components -- The cell renderer is a TanStack callback stabilized by useDataGridTable. */
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { InputControl, InputRoot } from '@fex/components-react/primitive/input'
import { Button } from '@fex/components-react/ui/button'
import { useState } from 'react'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const editingFeatures = tableFeatures({ columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })
type EditableField = 'name' | 'status' | 'visits'

export function CellEditingDataGridDemo() {
  const [rows, setRows] = useState(people6)
  const [editing, setEditing] = useState<{ rowId: string; field: EditableField } | null>(null)
  const updateCell = (rowId: string, field: EditableField, value: string) => {
    setRows((previous) => previous.map((row) => {
      if (row.id !== rowId) return row
      return { ...row, [field]: field === 'visits' ? Number(value) || 0 : value } as Person
    }))
    setEditing(null)
  }
  const columns: ColumnDef<typeof editingFeatures, Person>[] = (['name', 'status', 'visits'] as const).map((field) => ({
    accessorKey: field,
    header: field.charAt(0).toUpperCase() + field.slice(1),
    meta: field === 'visits' ? { align: 'right' } : undefined,
    cell: ({ row, getValue }) => {
      const isEditing = editing?.rowId === row.id && editing.field === field
      if (isEditing) {
        return (
          <InputRoot defaultValue={String(getValue() ?? '')}>
            <InputControl
              autoFocus
              type="text"
              aria-label={`Edit ${field} for ${row.id}`}
              onBlur={(event) => updateCell(row.id, field, event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') event.currentTarget.blur()
                if (event.key === 'Escape') setEditing(null)
              }}
            />
          </InputRoot>
        )
      }
      return <Button size="sm" variant="ghost" className="h-auto w-full justify-start px-0 text-inherit" onClick={() => setEditing({ rowId: row.id, field })}>{String(getValue() ?? '')}</Button>
    },
  } as ColumnDef<typeof editingFeatures, Person>))
  const table = useDataGridTable({ features: editingFeatures, data: rows, columns, getRowId: (row) => row.id })
  return (
    <DataGridDemoSection title="Cell editing" description="Editing belongs to application data, not a hidden table copy. Click a value, then press Enter or blur to commit; Escape cancels the current cell.">
      <DemoBranch title="Editable name, status and visits"><DataGrid table={table} /></DemoBranch>
    </DataGridDemoSection>
  )
}
