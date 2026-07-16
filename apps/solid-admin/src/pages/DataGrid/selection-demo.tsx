import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import {
  createDataGridSelectionColumn,
  DataGrid,
  tableFeatures,
  type ColumnDef,
} from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people6, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const selectionModules = { rowSelectionFeature, columnSizingFeature }
type SelectionFeatures = typeof selectionModules & {
  columnMeta: DataGridColumnMeta<SelectionFeatures, Person>
}
const selectionFeatures: SelectionFeatures = tableFeatures({ ...selectionModules, columnMeta: {} })

function SelectionGrid(props: { mode: 'multiple' | 'single'; disabled?: boolean }) {
  const columns: ColumnDef<SelectionFeatures, Person>[] = [
    createDataGridSelectionColumn<SelectionFeatures, Person>({ mode: props.mode }),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = createDataGridTable({
    features: selectionFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
    enableMultiRowSelection: props.mode === 'multiple',
    enableRowSelection: props.disabled ? (row) => row.original.status !== 'paused' : true,
  })
  const selected = () =>
    Object.keys(table.dataGridSnapshot().state.rowSelection).join(', ') || 'none'
  return (
    <div class="space-y-space-sm">
      <DataGrid table={table} />
      <p class="text-xs text-muted-foreground">Selected: {selected()}</p>
    </div>
  )
}

export function SelectionDataGridDemo() {
  return (
    <DataGridDemoSection
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
    </DataGridDemoSection>
  )
}
