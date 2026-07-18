import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { InputControl, InputRoot } from '@fex/components-solid/primitive/input'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { Button } from '@fex/components-solid/ui/button'
import { createSignal, Show } from 'solid-js'
import { people6, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

type RowEditingFeatures = {
  columnSizingFeature: typeof columnSizingFeature
  columnMeta: DataGridColumnMeta<RowEditingFeatures, Person>
}
const rowEditingFeatures: RowEditingFeatures = tableFeatures({
  columnSizingFeature,
  columnMeta: {},
})

export function RowEditingDataGridDemo() {
  const [rows, setRows] = createSignal(people6)
  const [draft, setDraft] = createSignal<Person | null>(null)
  const columns: ColumnDef<RowEditingFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => (
        <Show when={draft()?.id === row.id} fallback={String(getValue() ?? '')}>
          <InputRoot value={draft()?.name ?? ''}><InputControl
            value={draft()?.name ?? ''}
            aria-label={`Edit name for ${row.id}`}
            onInput={(event) => setDraft({ ...draft()!, name: event.currentTarget.value })}
          /></InputRoot>
        </Show>
      ),
    },
    {
      accessorKey: 'department',
      header: 'Department',
      cell: ({ row, getValue }) => (
        <Show when={draft()?.id === row.id} fallback={String(getValue() ?? '')}>
          <InputRoot value={draft()?.department ?? ''}><InputControl
            value={draft()?.department ?? ''}
            aria-label={`Edit department for ${row.id}`}
            onInput={(event) =>
              setDraft({
                ...draft()!,
                department: event.currentTarget.value as Person['department'],
              })
            }
          /></InputRoot>
        </Show>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row, getValue }) => (
        <Show when={draft()?.id === row.id} fallback={String(getValue() ?? '')}>
          <InputRoot value={draft()?.status ?? ''}><InputControl
            value={draft()?.status ?? ''}
            aria-label={`Edit status for ${row.id}`}
            onInput={(event) =>
              setDraft({ ...draft()!, status: event.currentTarget.value as Person['status'] })
            }
          /></InputRoot>
        </Show>
      ),
    },
    {
      id: '__actions__',
      header: 'Actions',
      size: 180,
      cell: ({ row }) => (
        <Show
          when={draft()?.id === row.id}
          fallback={<Button size="sm" variant="outline" onClick={() => setDraft({ ...row.original })}>Edit row</Button>}
        >
          <span class="inline-flex gap-space-sm">
            <Button size="sm" onClick={save}>
              Save
            </Button>
            <Button size="sm" variant="outline" onClick={() => setDraft(null)}>
              Cancel
            </Button>
          </span>
        </Show>
      ),
    },
  ]
  const table = createDataGridTable({
    features: rowEditingFeatures,
    data: rows(),
    columns,
    getRowId: (row) => row.id,
  })
  function save() {
    const current = draft()
    if (!current) return
    const next = rows().map((row) => (row.id === current.id ? current : row))
    setRows(next)
    setDraft(null)
    table.setDataGridOptions({
      features: rowEditingFeatures,
      data: next,
      columns,
      getRowId: (row) => row.id,
    })
  }
  return (
    <DataGridDemoSection
      title="Row editing"
      description="Edit row creates one application-owned draft. Save replaces that row in the caller data; Cancel discards the draft without touching the table data."
    >
      <DemoBranch title="Draft, save and cancel">
        <DataGrid table={table} />
      </DemoBranch>
    </DataGridDemoSection>
  )
}
