/* oxlint-disable react/no-unstable-nested-components -- TanStack cell renderers are configuration callbacks stabilized by useDataGridTable. */
import { rowPinningFeature } from '@fex/components-core/data-grid/features/row-pinning'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { Badge } from '@fex/components-react/ui/badge'
import { Button } from '@fex/components-react/ui/button'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people7, type Person } from './data'

const rowPinningFeatures = tableFeatures({ rowPinningFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

export function RowPinningDataGridDemo() {
  type PinnedRow = {
    id: string
    getIsPinned: () => false | 'top' | 'bottom'
    pin: (position: false | 'top' | 'bottom') => void
  }
  const columns: ColumnDef<typeof rowPinningFeatures, Person>[] = [
    { accessorKey: 'name', header: 'Name', cell: ({ row, getValue }: { row: PinnedRow; getValue: () => unknown }) => <span className="inline-flex items-center gap-2">{row.getIsPinned() ? <Badge variant="outline">Pinned {row.getIsPinned()}</Badge> : null}{String(getValue())}</span> } as unknown as ColumnDef<typeof rowPinningFeatures, Person>,
    { accessorKey: 'status', header: 'Status' },
    { id: 'pin', header: 'Pin row', cell: ({ row }: { row: PinnedRow }) => <span className="inline-flex gap-1"><Button size="sm" variant="outline" onClick={() => row.pin('top')}>Top</Button><Button size="sm" variant="outline" onClick={() => row.pin(false)}>Center</Button><Button size="sm" variant="outline" onClick={() => row.pin('bottom')}>Bottom</Button></span> } as unknown as ColumnDef<typeof rowPinningFeatures, Person>,
  ]
  const table = useDataGridTable({ features: rowPinningFeatures, data: people7, columns, getRowId: (row) => row.id, initialState: { rowPinning: { top: ['u-006'], bottom: ['u-002'] } } })
  return (
    <DataGridDemoSection title="Row pinning" description="Pinned rows are opaque layers above the scrollable center region. Their edge shadow appears only at the boundary, and the controls can add more rows to either region.">
      <DemoBranch title="Top, scrollable center and bottom"><DataGrid table={table} className={{ viewport: 'max-h-56' }} /></DemoBranch>
    </DataGridDemoSection>
  )
}
