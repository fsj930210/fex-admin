import type { DataGridColumnMeta } from './types'
import type { ColumnDef, FilterFn, RowData, SortFn, TableFeatures } from '@tanstack/table-core'

const remoteFilterFn = (() => true) as FilterFn<TableFeatures, RowData>
remoteFilterFn.autoRemove = (value) => value === undefined || value === null || value === ''

function createRemoteFilterFn<TFeatures extends TableFeatures, TData extends RowData>(): FilterFn<TFeatures, TData> {
  return remoteFilterFn as unknown as FilterFn<TFeatures, TData>
}

function createRemoteSortFn<TFeatures extends TableFeatures, TData extends RowData>(): SortFn<TFeatures, TData> {
  return () => 0
}

/** Maps DataGrid column meta to TanStack feature callbacks for every adapter. */
export function prepareDataGridColumns<
  TFeatures extends TableFeatures,
  TData extends RowData,
>(columns: readonly ColumnDef<TFeatures, TData>[]): readonly ColumnDef<TFeatures, TData>[] {
  return columns.map((column) => {
    const children = 'columns' in column ? column.columns : undefined
    if (children) {
      return {
        ...column,
        columns: prepareDataGridColumns(children),
      } as unknown as ColumnDef<TFeatures, TData>
    }

    const meta = column.meta as DataGridColumnMeta<TFeatures, TData> | undefined
    return {
      ...column,
      filterFn: (meta?.filterFn ?? createRemoteFilterFn<TFeatures, TData>()) as FilterFn<TFeatures, TData>,
      sortFn: (meta?.sortFn ?? createRemoteSortFn<TFeatures, TData>()) as SortFn<TFeatures, TData>,
    } as unknown as ColumnDef<TFeatures, TData>
  })
}
