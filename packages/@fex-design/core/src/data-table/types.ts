import type { FilterFn, RowData, SortFn, TableFeatures } from '@tanstack/table-core'

type BivariantCallback<TFunction> = TFunction extends (...args: infer TArguments) => infer TResult
  ? { bivarianceHack(...args: TArguments): TResult }['bivarianceHack']
  : never

type DataTableFilterFn<TFeatures extends TableFeatures, TData extends RowData> = BivariantCallback<
  FilterFn<TFeatures, TData>
> &
  Pick<FilterFn<TFeatures, TData>, 'autoRemove' | 'resolveDataValue' | 'resolveFilterValue'>

type DataTableSortFn<TFeatures extends TableFeatures, TData extends RowData> = BivariantCallback<
  SortFn<TFeatures, TData>
> &
  Pick<SortFn<TFeatures, TData>, 'resolveDataValue'>

export interface DataTableColumnMeta<
  TFeatures extends TableFeatures = TableFeatures,
  TData extends RowData = RowData,
> {
  /** Presence means this column is filtered locally. Absence means remote filtering. */
  filterFn?: DataTableFilterFn<TFeatures, TData>
  /** Presence means this column is sorted locally. Absence means remote sorting. */
  sortFn?: DataTableSortFn<TFeatures, TData>
  align?: 'left' | 'center' | 'right'
  headerClassName?: string
  cellClassName?: string
}
