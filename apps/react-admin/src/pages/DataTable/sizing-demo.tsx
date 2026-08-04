import {
  columnResizingFeature,
  columnSizingFeature,
} from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const sizingFeatures = tableFeatures({
  columnSizingFeature,
  columnResizingFeature,
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

function SizingGrid({
  direction,
  border = false,
}: {
  direction: 'onChange' | 'onEnd'
  border?: boolean
}) {
  const columns: ColumnDef<typeof sizingFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', size: 220, minSize: 140, maxSize: 320 },
    { accessorKey: 'department', header: 'Department', size: 180, minSize: 120 },
    { accessorKey: 'status', header: 'Status', size: 130, enableResizing: false },
    { accessorKey: 'progress', header: 'Progress', size: 140 },
  ]
  const table = useDataTable({
    features: sizingFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    columnResizeMode: direction,
  })
  return <DataTable table={table} border={border} />
}

export function SizingDataTableDemo() {
  return (
    <DataTableDemoSection
      title="Column sizing and resizing"
      description="Sizing and resizing remain separate v9 features. Drag a header separator; double-click resets the column. Status demonstrates per-column resize disablement."
    >
      <div className="grid gap-space-lg xl:grid-cols-2">
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
