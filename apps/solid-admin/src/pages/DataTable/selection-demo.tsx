import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import { rowSelectionFeature } from '@fex-design/core/data-table/features/row-selection'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import {
  createDataTableSelectionColumn,
  DataTable,
  tableFeatures,
  type ColumnDef,
} from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people6, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const selectionModules = { rowSelectionFeature, columnSizingFeature }
type SelectionFeatures = typeof selectionModules & {
  columnMeta: DataTableColumnMeta<SelectionFeatures, Person>
}
const selectionFeatures: SelectionFeatures = tableFeatures({ ...selectionModules, columnMeta: {} })

function SelectionGrid(props: { mode: 'multiple' | 'single'; disabled?: boolean }) {
  const columns: ColumnDef<SelectionFeatures, Person>[] = [
    createDataTableSelectionColumn<SelectionFeatures, Person>({ mode: props.mode }),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = createDataTable({
    features: selectionFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
    enableMultiRowSelection: props.mode === 'multiple',
    enableRowSelection: props.disabled ? (row) => row.original.status !== 'paused' : true,
  })
  const selected = () =>
    Object.keys(table.dataTableSnapshot().state.rowSelection).join(', ') || 'none'
  return (
    <div class="space-y-space-sm">
      <DataTable table={table} />
      <p class="text-xs text-muted-foreground">Selected: {selected()}</p>
    </div>
  )
}

export function SelectionDataTableDemo() {
  return (
    <DataTableDemoSection
      title="Row selection"
      description="The selection feature is headless; the reusable selection-column factory only supplies the conventional control column. Stable getRowId keeps selection independent from sorting and pagination."
    >
      <div class="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="Multiple + select all">
          <SelectionGrid mode="multiple" />
        </DemoBranch>
        <DemoBranch title="Single">
          <SelectionGrid mode="single" />
        </DemoBranch>
        <DemoBranch title="Conditional disabled rows">
          <SelectionGrid mode="multiple" disabled />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
