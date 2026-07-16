import { columnResizingFeature, columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const sizingFeatures = tableFeatures({ columnSizingFeature, columnResizingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

function SizingGrid({ direction, border = false }: { direction: 'onChange' | 'onEnd'; border?: boolean }) {
  const columns: ColumnDef<typeof sizingFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 },
    { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 },
    { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false },
    { accessorKey: 'progress', header: 'Progress', size: 140 },
  ]
  const table = useDataGridTable({ features: sizingFeatures, data: people5, columns, getRowId: (row) => row.id, columnResizeMode: direction })
  return <DataGrid table={table} border={border} />
}

export function SizingDataGridDemo() {
  return (
    <DataGridDemoSection title="Column sizing and resizing" description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement.">
      <div className="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Resize on change"><SizingGrid direction="onChange" /></DemoBranch>
        <DemoBranch title="Resize on end + bordered grid"><SizingGrid direction="onEnd" border /></DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
