import { columnPinningFeature } from '@fex-design/core/data-table/features/column-pinning'
import { columnSizingFeature } from '@fex-design/core/data-table/features/column-sizing'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import { DataTable, tableFeatures, type ColumnDef } from '@fex-design/solid/primitive/data-table'
import { createDataTable } from '@fex-design/solid/primitives/create-data-table'
import { Button } from '@fex-design/solid/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex-design/solid/icon/chevron'
import { MinusIcon } from '@fex-design/solid/icon/minus'
import { people6, type Person } from './data'
import { DataTableDemoSection, DemoBranch } from './demo-section'

const pinningModules = { columnPinningFeature, columnSizingFeature }
type PinningFeatures = typeof pinningModules & {
  columnMeta: DataTableColumnMeta<PinningFeatures, Person>
}
const pinningFeatures: PinningFeatures = tableFeatures({ ...pinningModules, columnMeta: {} })
interface PinnableColumn {
  pin: (position: false | 'start' | 'end') => void
}

export function ColumnPinningDataTableDemo() {
  const fields = ['name', 'department', 'status', 'age', 'visits', 'progress'] as const
  const columns: ColumnDef<PinningFeatures, Person>[] = fields.map((field) => ({
    accessorKey: field,
    header: ({ column }) => {
      const pinnable = column as unknown as PinnableColumn
      return (
        <span class="inline-flex items-center gap-1">
          {field}
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={`Pin ${field} to start`}
            onClick={() => pinnable.pin('start')}
          >
            <ChevronLeftIcon class="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={`Unpin ${field}`}
            onClick={() => pinnable.pin(false)}
          >
            <MinusIcon class="size-3.5" />
          </Button>
          <Button
            size="icon-xs"
            variant="ghost"
            aria-label={`Pin ${field} to end`}
            onClick={() => pinnable.pin('end')}
          >
            <ChevronRightIcon class="size-3.5" />
          </Button>
        </span>
      )
    },
    size: field === 'name' ? 180 : 130,
  }))
  const table = createDataTable({
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
