/* oxlint-disable react/no-unstable-nested-components -- TanStack cell renderers are configuration callbacks stabilized by useDataTable. */
import { rowPinningFeature } from '@fex-design/core/data-table/features/row-pinning'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { Badge } from '@fex-design/react/primitive/badge'
import { Button } from '@fex-design/react/ui/button'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people7, type Person } from './data'

const rowPinningFeatures = tableFeatures({
  rowPinningFeature,
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

export function RowPinningDataTableDemo() {
  type PinnedRow = {
    id: string
    getIsPinned: () => false | 'top' | 'bottom'
    pin: (position: false | 'top' | 'bottom') => void
  }
  const columns: ColumnDef<typeof rowPinningFeatures, Person>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row, getValue }: { row: PinnedRow; getValue: () => unknown }) => (
        <span className="inline-flex items-center gap-2">
          {row.getIsPinned() ? <Badge variant="outline">Pinned {row.getIsPinned()}</Badge> : null}
          {String(getValue())}
        </span>
      ),
    } as unknown as ColumnDef<typeof rowPinningFeatures, Person>,
    { accessorKey: 'status', header: 'Status' },
    {
      id: 'pin',
      header: 'Pin row',
      cell: ({ row }: { row: PinnedRow }) => (
        <span className="inline-flex gap-1">
          <Button size="sm" variant="outline" onClick={() => row.pin('top')}>
            Top
          </Button>
          <Button size="sm" variant="outline" onClick={() => row.pin(false)}>
            Center
          </Button>
          <Button size="sm" variant="outline" onClick={() => row.pin('bottom')}>
            Bottom
          </Button>
        </span>
      ),
    } as unknown as ColumnDef<typeof rowPinningFeatures, Person>,
  ]
  const table = useDataTable({
    features: rowPinningFeatures,
    data: people7,
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
        <DataTable table={table} className={{ viewport: 'max-h-56' }} />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
