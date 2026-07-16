import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
/* oxlint-disable react/no-unstable-nested-components -- TanStack cell renderers are configuration callbacks stabilized by useDataGridTable. */
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { Input } from '@fex/components-react/primitive/input'
import { Button } from '@fex/components-react/ui/button'
import { useState } from 'react'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const rowEditingFeatures = tableFeatures({ columnSizingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

export function RowEditingDataGridDemo() {
  const [rows, setRows] = useState(people6)
  const [draft, setDraft] = useState<Person | null>(null)
  const columns: ColumnDef<typeof rowEditingFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => draft?.id === row.id
        ? <Input value={draft.name} aria-label={`Edit name for ${row.id}`} onChange={(event) => setDraft({ ...draft, name: event.currentTarget.value })} />
        : String(getValue() ?? ''),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row, getValue }) => draft?.id === row.id
        ? <Input value={draft.department} aria-label={`Edit department for ${row.id}`} onChange={(event) => setDraft({ ...draft, department: event.currentTarget.value as Person['department'] })} />
        : String(getValue() ?? ''),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row, getValue }) => draft?.id === row.id
        ? <Input value={draft.status} aria-label={`Edit status for ${row.id}`} onChange={(event) => setDraft({ ...draft, status: event.currentTarget.value as Person['status'] })} />
        : String(getValue() ?? ''),
    },
    {
      id: '__actions__',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => draft?.id === row.id ? (
        <span className="inline-flex gap-space-sm">
          <Button size="sm" onClick={() => {
            setRows((previous) => previous.map((item) => item.id === draft.id ? draft : item))
            setDraft(null)
          }}>Save</Button>
          <Button size="sm" variant="outline" onClick={() => setDraft(null)}>Cancel</Button>
        </span>
      ) : <Button size="sm" variant="outline" onClick={() => setDraft({ ...row.original })}>Edit row</Button>,
    },
  ]
  const table = useDataGridTable({ features: rowEditingFeatures, data: rows, columns, getRowId: (row) => row.id })
  return (
    <DataGridDemoSection title="Row editing" description="Edit row creates one application-owned draft. Save replaces that row in the caller data; Cancel discards the draft without touching the table data.">
      <DemoBranch title="Draft, save and cancel"><DataGrid table={table} /></DemoBranch>
    </DataGridDemoSection>
  )
}
