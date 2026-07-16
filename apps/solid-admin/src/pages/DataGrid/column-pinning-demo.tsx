import { columnPinningFeature } from '@fex/components-core/data-grid/features/column-pinning'
import { columnSizingFeature } from '@fex/components-core/data-grid/features/column-sizing'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import { DataGrid, tableFeatures, type ColumnDef } from '@fex/components-solid/primitive/data-grid'
import { createDataGridTable } from '@fex/components-solid/primitives/create-data-grid-table'
import { Button } from '@fex/components-solid/ui/button'
import { ChevronLeftIcon, ChevronRightIcon } from '@fex/components-solid/icon/chevron'
import { MinusIcon } from '@fex/components-solid/icon/minus'
import { people6, type Person } from './data'
import { DataGridDemoSection, DemoBranch } from './demo-section'

const pinningModules = { columnPinningFeature, columnSizingFeature }
type PinningFeatures = typeof pinningModules & {
  columnMeta: DataGridColumnMeta<PinningFeatures, Person>
}
const pinningFeatures: PinningFeatures = tableFeatures({ ...pinningModules, columnMeta: {} })
interface PinnableColumn {
  pin: (position: false | 'start' | 'end') => void
}

export function ColumnPinningDataGridDemo() {
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
  const table = createDataGridTable({
    features: pinningFeatures,
    data: people6,
    columns,
    getRowId: (row) => row.id,
    initialState: { columnPinning: { start: ['name'], end: ['progress'] } },
  })
  return (
    <DataGridDemoSection
      title="Column pinning"
      description="TanStack v9 uses logical start/end regions. DataGrid only renders their sticky layout; callers can provide any pin controls and can keep DnD restrictions outside the component."
    >
      <DemoBranch title="Start, center and end regions">
        <DataGrid table={table} />
      </DemoBranch>
    </DataGridDemoSection>
  )
}
