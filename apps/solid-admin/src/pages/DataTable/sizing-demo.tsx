import {
  columnResizingFeature,
  columnSizingFeature,
} from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { people5, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const sizingModules = { columnSizingFeature, columnResizingFeature }
type SizingFeatures = typeof sizingModules & {
  columnMeta: DataTableColumnMeta<SizingFeatures, Person>
}
const sizingFeatures: SizingFeatures = tableFeatures({ ...sizingModules, columnMeta: {} })

function SizingGrid(props: { direction: 'onChange' | 'onEnd'; border?: boolean }) {
  const columns: ColumnDef<SizingFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 },
    { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 },
    { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false },
    { accessorKey: 'progress', header: 'Progress', size: 140 },
  ]
  const table = createDataTable({
    features: sizingFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    columnResizeMode: props.direction,
  })
  return <DataTable table={table} border={props.border ?? false} />
}

export function SizingDataTableDemo() {
  return (
    <DataTableDemoSection
      title="Column sizing and resizing"
      description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement."
    >
      <div class="grid gap-space-lg xl:grid-cols-2">
        <DemoBranch title="Resize on change">
          <SizingGrid direction="onChange" />
        </DemoBranch>
        <DemoBranch title="Resize on end + bordered table">
          <SizingGrid direction="onEnd" border />
        </DemoBranch>
      </div>
    </DataTableDemoSection>
  )
}
