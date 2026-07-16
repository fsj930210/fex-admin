import type { FilterFn, RowData, TableFeatures } from '@tanstack/table-core'

export {
  columnFilteringFeature,
  createFilteredRowModel,
  filterFn_arrIncludes,
  filterFn_arrIncludesAll,
  filterFn_arrIncludesSome,
  filterFn_equals,
  filterFn_equalsString,
  filterFn_inNumberRange,
  filterFn_includesString,
  filterFn_includesStringSensitive,
  filterFn_weakEquals,
} from '@tanstack/table-core'
export type { ColumnFilter, ColumnFiltersState, FilterFn } from '@tanstack/table-core'

/** Keeps a remotely filtered column in the shared filter state without filtering local rows. */
export const dataGridRemoteFilterFn: FilterFn<TableFeatures, RowData> = () => true
dataGridRemoteFilterFn.autoRemove = (value) => value === undefined || value === null || value === ''
