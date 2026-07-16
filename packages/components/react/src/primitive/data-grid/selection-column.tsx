import type { ColumnDef, RowData, TableFeatures } from '@tanstack/react-table'
import { Radio, RadioGroup } from '../radio/radio'
import { DataGridCheckbox } from './data-grid-checkbox'

export interface DataGridSelectionColumnOptions {
  id?: string
  mode?: 'multiple' | 'single'
  size?: number
  ariaLabel?: string
}

export function createDataGridSelectionColumn<
  TFeatures extends TableFeatures,
  TData extends RowData,
>({
  id = '__selection__',
  mode = 'multiple',
  size = 40,
  ariaLabel = 'Select row',
}: DataGridSelectionColumnOptions = {}): ColumnDef<TFeatures, TData> {
  type SelectionTable = {
    getIsAllRowsSelected: () => boolean
    getIsSomeRowsSelected: () => boolean
    toggleAllRowsSelected: (selected?: boolean) => void
  }
  type SelectionRow = {
    id: string
    getCanSelect: () => boolean
    getIsSelected: () => boolean
    getIsSomeSelected: () => boolean
    toggleSelected: (selected?: boolean) => void
  }
  return {
    id,
    size,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    header: ({ table }: { table: SelectionTable }) => mode === 'multiple' ? (
      <DataGridCheckbox
        aria-label="Select all rows"
        checked={table.getIsAllRowsSelected() ? true : table.getIsSomeRowsSelected() ? 'indeterminate' : false}
        onCheckedChange={(checked) => table.toggleAllRowsSelected(checked === true)}
      />
    ) : null,
    cell: ({ row }: { row: SelectionRow }) => mode === 'multiple' ? (
      <DataGridCheckbox
        aria-label={`${ariaLabel} ${row.id}`}
        disabled={!row.getCanSelect()}
        checked={row.getIsSelected() ? true : row.getIsSomeSelected() ? 'indeterminate' : false}
        onCheckedChange={(checked) => row.toggleSelected(checked === true)}
      />
    ) : (
      <RadioGroup
        orientation="horizontal"
        {...(row.getIsSelected() ? { value: row.id } : {})}
        onValueChange={() => row.toggleSelected(true)}
      >
        <Radio
          value={row.id}
          aria-label={`${ariaLabel} ${row.id}`}
          disabled={!row.getCanSelect()}
        />
      </RadioGroup>
    ),
  } as unknown as ColumnDef<TFeatures, TData>
}
