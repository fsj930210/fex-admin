import { columnOrderingFeature, moveDataGridColumn } from '@fex/components-core/data-grid/features/column-ordering'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { Button } from '@fex/components-react/ui/button'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people5, type Person } from './data'

const orderingFeatures = tableFeatures({ columnOrderingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })
const ids = ['name', 'department', 'status', 'visits']

export function OrderingDataGridDemo() {
  const columns: ColumnDef<typeof orderingFeatures, Person>[] = ids.map((id) => ({ accessorKey: id, header: id.charAt(0).toUpperCase() + id.slice(1) } as ColumnDef<typeof orderingFeatures, Person>))
  const table = useDataGridTable({ features: orderingFeatures, data: people5, columns, getRowId: (row) => row.id, initialState: { columnOrder: ids } })
  return (
    <DataGridDemoSection title="Column ordering" description="The feature only owns columnOrder and actions. These buttons are one possible UI; DnD is demonstrated separately as caller-owned behavior.">
      <DemoBranch title="Programmatic reorder">
        <div className="space-y-space-sm">
          <div className="flex flex-wrap gap-space-sm">
            <Button size="sm" variant="outline" onClick={() => table.setColumnOrder((order) => moveDataGridColumn(order, 'status', 'name'))}>Move Status first</Button>
            <Button size="sm" variant="outline" onClick={() => table.resetColumnOrder()}>Reset</Button>
          </div>
          <DataGrid table={table} />
        </div>
      </DemoBranch>
    </DataGridDemoSection>
  )
}
