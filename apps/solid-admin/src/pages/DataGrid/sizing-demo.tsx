import {
  columnResizingFeature,
  columnSizingFeature,
} from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { people5, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const sizingModules = { columnSizingFeature, columnResizingFeature }
type SizingFeatures = typeof sizingModules & {
  columnMeta: DataGridColumnMeta<SizingFeatures, Person>
}
const sizingFeatures: SizingFeatures = tableFeatures({ ...sizingModules, columnMeta: {} })

function SizingGrid(props: { direction: 'onChange' | 'onEnd'; border?: boolean }) {
  const columns: ColumnDef<SizingFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 },
    { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 },
    { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false },
    { accessorKey: 'progress', header: 'Progress', size: 140 },
  ]
  const table = createDataGridTable({
    features: sizingFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    columnResizeMode: props.direction,
  })
  return <DataGrid table={table} border={props.border ?? false} />
}

export function SizingDataGridDemo() {
  return (
    <DataGridDemoSection
      title="Column sizing and resizing"
      description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement."
    >
      <div class="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Resize on change">
          <SizingGrid direction="onChange" />
        </DemoBranch>
        <DemoBranch title="Resize on end + bordered grid">
          <SizingGrid direction="onEnd" border />
        </DemoBranch>
      </div>
    </DataGridDemoSection>
  )
}
