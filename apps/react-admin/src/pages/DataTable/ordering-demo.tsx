import {
  columnOrderingFeature,
  moveDataTableColumn,
} from '@fex-design/core/data-table/features/column-ordering'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { Button } from '@fex-design/react/ui/button'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const orderingFeatures = tableFeatures({
  columnOrderingFeature,
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})
const ids = ['name', 'department', 'status', 'visits']

export function OrderingDataTableDemo() {
  const columns: ColumnDef<typeof orderingFeatures, Person>[] = ids.map(
    (id) =>
      ({ accessorKey: id, header: id.charAt(0).toUpperCase() + id.slice(1) }) as ColumnDef<
        typeof orderingFeatures,
        Person
      >,
  )
  const table = useDataTable({
    features: orderingFeatures,
    data: people5,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnOrder: ids },
  })
  return (
    <DataTableDemoSection
      title="Column ordering"
      description="The feature only owns columnOrder and actions. These buttons are one possible UI; DnD is demonstrated separately as caller-owned behavior."
    >
      <DemoBranch title="Programmatic reorder">
        <div className="space-y-space-sm">
          <div className="flex flex-wrap gap-space-sm">
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
