import {
  columnOrderingFeature,
  moveDataTableColumn,
} from '@fex-design/core/data-table/features/column-ordering'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { Button } from '@fex-design/solid/ui/button'
import { people5, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const orderingModules = { columnOrderingFeature }
type OrderingFeatures = typeof orderingModules & {
  columnMeta: DataTableColumnMeta<OrderingFeatures, Person>
}
const orderingFeatures: OrderingFeatures = tableFeatures({ ...orderingModules, columnMeta: {} })
const ids = ['name', 'department', 'status', 'visits'] as const

export function OrderingDataTableDemo() {
  const columns: ColumnDef<OrderingFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
    { accessorKey: 'status', header: 'Status' },
    { accessorKey: 'visits', header: 'Visits' },
  ]
  const table = createDataTable({
    features: orderingFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnOrder: [...ids] },
  })
  return (
    <DataTableDemoSection
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
                table.setColumnOrder((order) => moveDataTableColumn(order, 'status', 'name'))
              }
            >
              Move Status first
            </Button>
            <Button size="sm" variant="outline" onClick={() => table.resetColumnOrder()}>
              Reset
            </Button>
          </div>
          <DataTable table={table} />
        </div>
      </DemoBranch>
    </DataTableDemoSection>
  )
}
