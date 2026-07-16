import type { RowData, TableFeatures, TableOptions, TableState } from '@tanstack/react-table'
import { useTable, type ReactTable } from '@tanstack/react-table'
import { useStableDataGridColumns } from './use-stable-data-grid-columns'

export function useDataGridTable<
  TFeatures extends TableFeatures,
  TData extends RowData,
  TSelected = TableState<TFeatures>,
>(
  options: TableOptions<TFeatures, TData>,
  selector?: (state: TableState<TFeatures>) => TSelected,
): ReactTable<TFeatures, TData, TSelected> {
  if (!options.getRowId) {
    throw new Error('[DataGrid] getRowId is required so row identity never falls back to array position.')
  }
  const columns = useStableDataGridColumns(options.columns)
  // TanStack v9 syncs legacy options.state into its atoms from useTable's render.
  // A full store selector would subscribe this same component to that write and
  // cause a render-phase update for controlled slices. The React owner already
  // rerenders after its onXxxChange callback, so use a stable no-op projection
  // unless the caller explicitly requests a table-store selector.
  const table = useTable<TFeatures, TData, TSelected>(
    { ...options, columns },
    selector ?? (options.state ? (() => null as TSelected) : undefined),
  )
  return options.state && !selector
    ? { ...table, state: options.state as TSelected }
    : table
}
