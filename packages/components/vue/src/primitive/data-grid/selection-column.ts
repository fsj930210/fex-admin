import type {
  CellContext,
  ColumnDef,
  HeaderContext,
  RowData,
  TableFeatures,
} from '@tanstack/table-core'
import { h } from 'vue'
import DataGridCheckbox from './data-grid-checkbox.vue'
import { Radio, RadioGroup } from '../radio/radio'
interface SelectionTable {
  getIsAllRowsSelected(): boolean
  getIsSomeRowsSelected(): boolean
  toggleAllRowsSelected(value: boolean): void
}
interface SelectionRow {
  id: string
  getCanSelect(): boolean
  getIsSelected(): boolean
  getIsSomeSelected(): boolean
  toggleSelected(value: boolean): void
}
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
  const header = (context: HeaderContext<TFeatures, TData, unknown>) => {
    const table = context.table as unknown as SelectionTable
    return mode === 'multiple'
      ? h(DataGridCheckbox, {
          ariaLabel: 'Select all rows',
          checked: table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? 'indeterminate'
              : false,
          onChange: (checked) => table.toggleAllRowsSelected(checked === true),
        })
      : null
  }
  const cell = (context: CellContext<TFeatures, TData, unknown>) => {
    const row = context.row as unknown as SelectionRow
    return mode === 'multiple'
      ? h(DataGridCheckbox, {
          ariaLabel: `${ariaLabel} ${row.id}`,
          disabled: !row.getCanSelect(),
          checked: row.getIsSelected() ? true : row.getIsSomeSelected() ? 'indeterminate' : false,
          onChange: (checked) => row.toggleSelected(checked === true),
        })
      : h(
          RadioGroup,
          {
            orientation: 'horizontal',
            value: row.getIsSelected() ? row.id : '',
            onValueChange: () => row.toggleSelected(true),
          },
          () =>
            h(Radio, {
              value: row.id,
              disabled: !row.getCanSelect(),
              'aria-label': `${ariaLabel} ${row.id}`,
            }),
        )
  }
  return {
    id,
    size,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    header,
    cell,
  } as unknown as ColumnDef<TFeatures, TData>
}
