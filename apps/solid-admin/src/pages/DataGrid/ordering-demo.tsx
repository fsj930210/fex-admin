import {
  columnOrderingFeature,
  moveDataGridColumn,
} from '@fex/components-core/data-grid/features/column-ordering'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { Button } from '@fex/components-solid/ui/button'
import { people5, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const orderingModules = { columnOrderingFeature }
type OrderingFeatures = typeof orderingModules & {
  columnMeta: DataGridColumnMeta<OrderingFeatures, Person>
}
const orderingFeatures: OrderingFeatures = tableFeatures({ ...orderingModules, columnMeta: {} })
const ids = ['name', 'department', 'status', 'visits'] as const

export function OrderingDataGridDemo() {
  const columns: ColumnDef<OrderingFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  const table = createDataGridTable({
    features: orderingFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnOrder: [...ids] },
  })
  return (
    <DataGridDemoSection
      title="Column ordering"
      description="The feature only owns columnOrder and actions. These buttons are one possible UI; DnD is demonstrated separately as caller-owned behavior."
    >
      <DemoBranch title="Programmatic reorder">
        <div class="space-y-space-sm">
          <div class="flex flex-wrap gap-space-sm">
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                table.setColumnOrder((order) => moveDataGridColumn(order, 'status', 'name'))
              }
            >
              Move Status first
            </Button>
            <Button size="sm" variant="outline" onClick={() => table.resetColumnOrder()}>
              Reset
            </Button>
          </div>
          <DataGrid table={table} />
        </div>
      </DemoBranch>
    </DataGridDemoSection>
  )
}
