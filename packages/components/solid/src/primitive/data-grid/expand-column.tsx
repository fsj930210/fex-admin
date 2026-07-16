import type { CellContext, ColumnDef, RowData, TableFeatures } from '@tanstack/table-core'
import { MinusIcon } from '../../icon/minus'
import { PlusIcon } from '../../icon/plus'
import { Button } from '../../ui/button/button'

interface ExpandableRow {
  id: string
  getCanExpand: () => boolean
  getIsExpanded: () => boolean
  getToggleExpandedHandler: () => (event: MouseEvent) => void
}

export interface DataGridExpandColumnOptions { id?: string; size?: number; ariaLabel?: string }

export function createDataGridExpandColumn<TFeatures extends TableFeatures, TData extends RowData>({ id = '__expand__', size = 40, ariaLabel = 'Toggle row' }: DataGridExpandColumnOptions = {}): ColumnDef<TFeatures, TData> {
  const cell = (context: CellContext<TFeatures, TData, unknown>) => {
    const row = context.row as unknown as ExpandableRow
    return row.getCanExpand() ? <Button aria-label={`${ariaLabel} ${row.id}`} aria-expanded={row.getIsExpanded()} size="icon-sm" variant="outline" onClick={row.getToggleExpandedHandler()}>{row.getIsExpanded() ? <MinusIcon class="size-4" /> : <PlusIcon class="size-4" />}</Button> : null
  }
  return { id, size, enableSorting: false, enableColumnFilter: false, enableHiding: false, header: '', cell } as unknown as ColumnDef<TFeatures, TData>
}
