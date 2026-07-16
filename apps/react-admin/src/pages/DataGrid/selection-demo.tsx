import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { createDataGridSelectionColumn, DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const selectionFeatures = tableFeatures({ rowSelectionFeature, columnSizingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

function SelectionGrid({ mode, disabled }: { mode: 'multiple' | 'single'; disabled?: boolean }) {
  const columns: ColumnDef<typeof selectionFeatures, Person>[] = [
    createDataGridSelectionColumn<typeof selectionFeatures, Person>({ mode }),
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'status', header: 'Status' },
  ]
  const table = useDataGridTable({
    features: selectionFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
    enableMultiRowSelection: mode === 'multiple',
    enableRowSelection: disabled ? (row) => row.original.status !== 'paused' : true,
  })
  return <div className="space-y-space-sm"><DataGrid table={table} /><p className="text-xs text-muted-foreground">Selected: {Object.keys(table.state.rowSelection).join(', ') || 'none'}</p></div>
}

export function SelectionDataGridDemo() {
  return (
    <DataGridDemoSection title="Row selection" description="The selection feature is headless; the reusable selection-column factory only supplies the conventional control column. Stable getRowId keeps selection independent from sorting and pagination.">
      <div className="grid gap-space-lg xl:grid-cols-3">
        <DemoBranch title="Multiple + select all"><SelectionGrid mode="multiple" /></DemoBranch>
        <DemoBranch title="Single"><SelectionGrid mode="single" /></DemoBranch>
        <DemoBranch title="Conditional disabled rows"><SelectionGrid mode="multiple" disabled /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
