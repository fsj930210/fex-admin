/* oxlint-disable react/no-unstable-nested-components -- TanStack header renderers are configuration callbacks stabilized by useDataTable. */
import { columnPinningFeature } from '@fex-design/core/data-table/features/column-pinning'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TableFeatures } from '@fex-design/react/primitive/data-table'
import {
  DataTable,
  tableFeatures,
  useDataTable,
  type ColumnDef,
} from '@fex-design/react/primitive/data-table'
import { Button } from '@fex-design/react/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/react/icon/chevron'
import { MinusIcon } from '@fex-design/react/icon/minus'
import { DataTableDemoSection, DemoBranch } from './demo-section'
import { people6, type Person } from './data'

const pinningFeatures = tableFeatures({
  columnPinningFeature,
  columnSizingFeature,
  columnMeta: {} as DataTableColumnMeta<TableFeatures, Person>,
})

type PinnableColumn = {
  pin: (position: 'start' | 'end' | false) => void
}

export function ColumnPinningDataTableDemo() {
  const fields = ['name', 'department', 'status', 'age', 'visits', 'progress'] as const
  const columns: ColumnDef<typeof pinningFeatures, Person>[] = fields.map(
    (field) =>
      ({
        accessorKey: field,
        header: ({ column }: { column: PinnableColumn }) => (
          <span className="inline-flex items-center gap-1">
            {field}
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Pin ${field} to start`}
              onClick={() => column.pin('start')}
            >
              <ChevronLeftIcon className="size-3.5" />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Unpin ${field}`}
              onClick={() => column.pin(false)}
            >
              <MinusIcon className="size-3.5" />
            </Button>
            <Button
              size="icon-xs"
              variant="ghost"
              aria-label={`Pin ${field} to end`}
              onClick={() => column.pin('end')}
            >
              <ChevronRightIcon className="size-3.5" />
            </Button>
          </span>
        ),
        size: field === 'name' ? 180 : 130,
      }) as unknown as ColumnDef<typeof pinningFeatures, Person>,
  )
  const table = useDataTable({
    features: pinningFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnPinning: { start: ['name'], end: ['progress'] } },
  })
  return (
    <DataTableDemoSection
      title="Column pinning"
      description="TanStack v9 uses logical start/end regions. DataTable only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component."
    >
      <DemoBranch title="Start, center and end regions">
        <DataTable table={table} />
      </DemoBranch>
    </DataTableDemoSection>
  )
}
