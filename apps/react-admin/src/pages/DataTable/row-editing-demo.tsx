import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
/* oxlint-disable react/no-unstable-nested-components -- TanStack cell renderers are configuration callbacks stabilized by useDataTable. */
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { InputControl, InputRoot } from '@fex-design/react/primitive/input'
import { Button } from '@fex-design/react/ui/button'
import { useState } from 'react'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const rowEditingFeatures = tableFeatures({
  columnSizingFeature,
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

export function RowEditingDataTableDemo() {
  const [rows, setRows] = useState(people6)
  const [draft, setDraft] = useState<Person | null>(null)
  const columns: ColumnDef<typeof rowEditingFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) =>
        draft?.id === row.id ? (
          <InputRoot value={draft.name} className="w-full">
            <InputControl
              aria-label={`Edit name for ${row.id}`}
              onChange={(event) => setDraft({ ...draft, name: event.currentTarget.value })}
            />
          </InputRoot>
        ) : (
          String(getValue() ?? '')
        ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row, getValue }) =>
        draft?.id === row.id ? (
          <InputRoot value={draft.department} className="w-full">
            <InputControl
              aria-label={`Edit department for ${row.id}`}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  department: event.currentTarget.value as Person['department'],
                })
              }
            />
          </InputRoot>
        ) : (
          String(getValue() ?? '')
        ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row, getValue }) =>
        draft?.id === row.id ? (
          <InputRoot value={draft.status} className="w-full">
            <InputControl
              aria-label={`Edit status for ${row.id}`}
              onChange={(event) =>
                setDraft({ ...draft, status: event.currentTarget.value as Person['status'] })
              }
            />
          </InputRoot>
        ) : (
          String(getValue() ?? '')
        ),
    },
    {
      id: '__actions__',
      header: 'Actions',
      size: 180,
      cell: ({ row }) =>
        draft?.id === row.id ? (
          <span className="inline-flex gap-space-sm">
            <Button
              size="sm"
              onClick={() => {
                setRows((previous) => previous.map((item) => (item.id === draft.id ? draft : item)))
                setDraft(null)
              }}
            >
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </span>
        ) : (
          <Button size="sm" variant="outline" onClick={() => setDraft({ ...row.original })}>
            Edit row
          </Button>
        ),
    },
  ]
  const table = useDataTable({
    features: rowEditingFeatures,
    data: rows,
    columns,
    getRowId: (row) => row.id,
  })
  return (
    <DataTableDemoSection
      title="Row editing"
      description="Edit row creates one application-owned draft. Save replaces that row in the caller data; Cancel discards the draft without touching the table data."
    >
      <DemoBranch title="Draft, save and cancel">
        <DataTable table={table} />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
