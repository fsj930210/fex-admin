/* oxlint-disable react/no-unstable-nested-components -- TanStack header renderers are configuration callbacks stabilized by useDataGridTable. */
import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TableFeatures } from '@fex/components-react/primitive/data-grid'
import { DataGrid, tableFeatures, useDataGridTable, type ColumnDef } from '@fex/components-react/primitive/data-grid'
import { Button } from '@fex/components-react/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-react/icon/chevron'
import { MinusIcon } from '@fex/components-react/icon/minus'
import { DataGridDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const pinningFeatures = tableFeatures({ columnPinningFeature, columnSizingFeature, columnMeta: {} as DataGridColumnMeta<TableFeatures, Person> })

type PinnableColumn = {
  pin: (position: 'start' | 'end' | false) => void
}

export function ColumnPinningDataGridDemo() {
  const fields = ['name', 'department', 'status', 'age', 'visits', 'progress'] as const
  const columns: ColumnDef<typeof pinningFeatures, Person>[] = fields.map((field) => ({
    accessorKey: field,
    header: ({ column }: { column: PinnableColumn }) => (
      <span className="inline-flex items-center gap-1">
        {field}
        <Button size="icon-xs" variant="ghost" aria-label={`Pin ${field} to start`} onClick={() => column.pin('start')}><ChevronLeftIcon className="size-3.5" /></Button>
        <Button size="icon-xs" variant="ghost" aria-label={`Unpin ${field}`} onClick={() => column.pin(false)}><MinusIcon className="size-3.5" /></Button>
        <Button size="icon-xs" variant="ghost" aria-label={`Pin ${field} to end`} onClick={() => column.pin('end')}><ChevronRightIcon className="size-3.5" /></Button>
      </span>
    ),
    size: field === 'name' ? 180 : 130,
  }) as unknown as ColumnDef<typeof pinningFeatures, Person>)
  const table = useDataGridTable({ features: pinningFeatures, data: people6, columns, getRowId: (row) => row.id, initialState: { columnPinning: { start: ['name'], end: ['progress'] } } })
  return (
    <DataGridDemoSection title="Column pinning" description="TanStack v9 uses logical start/end regions. DataGrid only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component.">
      <DemoBranch title="Start, center and end regions"><DataGrid table={table} /></DemoBranch>
    </DataGridDemoSection>
  )
}
