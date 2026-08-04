import { rowPinningFeature } from '@fex-design/core/data-table/features/row-pinning'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { Badge } from '@fex-design/solid/ui/badge'
import { Button } from '@fex-design/solid/ui/button'
import { people, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const rowPinningModules = { rowPinningFeature }
type RowPinningFeatures = typeof rowPinningModules & {
  columnMeta: DataTableColumnMeta<RowPinningFeatures, Person>
}
const rowPinningFeatures: RowPinningFeatures = tableFeatures({
  ...rowPinningModules,
  columnMeta: {},
})
interface PinnableRow {
  getIsPinned: () => false | 'top' | 'bottom'
  pin: (position: false | 'top' | 'bottom') => void
}

export function RowPinningDataTableDemo() {
  const columns: ColumnDef<RowPinningFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }) => {
        const pinnable = row as unknown as PinnableRow
        return (
          <span class="inline-flex items-center gap-2">
            {pinnable.getIsPinned() ? (
              <Badge variant="outline">Pinned {pinnable.getIsPinned()}</Badge>
            ) : null}
            {String(getValue())}
          </span>
        )
      },
    },
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'pin',
      header: 'Pin row',
      cell: ({ row }) => {
        const pinnable = row as unknown as PinnableRow
        return (
          <span class="inline-flex gap-1">
            <Button size="sm" variant="outline" onClick={() => pinnable.pin('top')}>
              Top
            </Button>
            <Button size="sm" variant="outline" onClick={() => pinnable.pin(false)}>
              Center
            </Button>
            <Button size="sm" variant="outline" onClick={() => pinnable.pin('bottom')}>
              Bottom
            </Button>
          </span>
        )
      },
    },
  ]
  const table = createDataTable({
    features: rowPinningFeatures,
    data: people.slice(0, 7),
    columns,
    getRowId: (row) => row.id,
    initialState: { rowPinning: { top: ['u-006'], bottom: ['u-002'] } },
  })
  return (
    <DataTableDemoSection
      title="Row pinning"
      description="Pinned rows are opaque layers above the scrollable center region. Their edge shadow appears only at the boundary, and the controls can add more rows to either region."
    >
      <DemoBranch title="Top, scrollable center and bottom">
        <DataTable table={table} class={{ viewport: 'max-h-56' }} />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
