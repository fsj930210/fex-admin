import type { RowData, SortFn, TableFeatures } from '@tanstack/table-core'

export {
  createSortedRowModel,
  rowSortingFeature,
  sortFn_alphanumeric,
  sortFn_alphanumericCaseSensitive,
  sortFn_basic,
  sortFn_datetime,
  sortFn_text,
  sortFn_textCaseSensitive,
} from '@tanstack/table-core'
export type { ColumnSort, SortDirection, SortingState, SortFn } from '@tanstack/table-core'

/** Keeps a remotely sorted column in the shared sorting state without changing local row order. */
export const dataGridRemoteSortFn: SortFn<TableFeatures, RowData> = () => 0

