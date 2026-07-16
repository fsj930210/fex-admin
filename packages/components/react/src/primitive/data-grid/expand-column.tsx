import type { ColumnDef, RowData, TableFeatures } from '@tanstack/react-table'
import { MinusIcon } from '../../icon/minus'
import { PlusIcon } from '../../icon/plus'
import { Button } from '../../ui/button/button'

export interface DataGridExpandColumnOptions {
  id?: string
  size?: number
  ariaLabel?: string
}

export function createDataGridExpandColumn<TFeatures extends TableFeatures, TData extends RowData>({
  id = '__expand__',
  size = 40,
  ariaLabel = 'Toggle row',
}: DataGridExpandColumnOptions = {}): ColumnDef<TFeatures, TData> {
  type ExpandRow = {
    id: string
    getCanExpand: () => boolean
    getIsExpanded: () => boolean
    getToggleExpandedHandler: () => () => void
  }
  return {
    id,
    size,
    enableSorting: false,
    enableColumnFilter: false,
    enableHiding: false,
    header: '',
    cell: ({ row }: { row: ExpandRow }) => row.getCanExpand() ? (
      <Button
        aria-label={`${ariaLabel} ${row.id}`}
        aria-expanded={row.getIsExpanded()}
        size="icon-sm"
        variant="outline"
        onClick={row.getToggleExpandedHandler()}
      >
        {row.getIsExpanded() ? <MinusIcon className="size-4" /> : <PlusIcon className="size-4" />}
      </Button>
    ) : null,
  } as unknown as ColumnDef<TFeatures, TData>
}
