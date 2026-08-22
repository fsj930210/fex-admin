import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core'
import { rowSelectionFeature } from '@fex-design/core/data-table/features/row-selection'
import type { DataTableColumnMeta } from '@fex-design/core/data-table/types'
import type { TransferPanelApi } from '@fex-design/angular/primitive/transfer'
import {
  DataTable,
  DataTableCellTemplate,
  DataTableHeaderTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type Header,
} from '@fex-design/angular/primitive/data-table'
import { createDataTable } from '@fex-design/angular/signals/create-data-table'
import { Checkbox } from '@fex-design/angular/ui/checkbox'
import type { TransferMember } from './data'

const modules = { rowSelectionFeature }
type Features = typeof modules & { columnMeta: DataTableColumnMeta<Features, TransferMember> }
type SelectionTable = ReturnType<typeof createDataTable<Features, TransferMember>> & {
  getIsAllRowsSelected(): boolean
  getIsSomeRowsSelected(): boolean
  toggleAllRowsSelected(value?: boolean): void
}

@Component({
  selector: 'fex-transfer-table-panel',
  standalone: true,
  imports: [DataTable, DataTableCellTemplate, DataTableHeaderTemplate, Checkbox],
  templateUrl: './table-panel.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransferTablePanelComponent {
  readonly panel = input.required<TransferPanelApi<TransferMember>>()
  private readonly features: Features = tableFeatures({ ...modules, columnMeta: {} })
  private readonly columns: ColumnDef<Features, TransferMember>[] = [
    { id: '__select__', header: 'Select' },
    { accessorKey: 'name', header: 'Name' },
    { accessorKey: 'department', header: 'Department' },
  ]
  protected readonly table = createDataTable({
    features: this.features,
    data: [] as TransferMember[],
    columns: this.columns,
    getRowId: (row) => row.id,
  }) as SelectionTable

  constructor() {
    effect(() => {
      const panel = this.panel()
      const selection = Object.fromEntries(
        panel.checkedKeys.map((key) => [String(key), true as const]),
      )
      this.table.setDataTableOptions({
        features: this.features,
        data: panel.items,
        columns: this.columns,
        getRowId: (row) => row.id,
        enableRowSelection: (row) => row.original.disabled !== true,
        state: { rowSelection: selection },
        onRowSelectionChange: (updater) => {
          const next = typeof updater === 'function' ? updater(selection) : updater
          panel.setCheckedKeys(Object.keys(next).filter((key) => next[key]))
        },
      })
    })
  }

  protected headerLabel(header: Header<Features, TransferMember>) {
    return header.column.columnDef.header
  }
  protected value(cell: Cell<Features, TransferMember>) {
    return cell.getValue()
  }
  protected selected(cell: Cell<Features, TransferMember>) {
    return cell.row.getIsSelected()
  }
  protected disabled(cell: Cell<Features, TransferMember>) {
    return !cell.row.getCanSelect()
  }
  protected toggle(cell: Cell<Features, TransferMember>, checked: boolean | 'indeterminate') {
    cell.row.toggleSelected(checked === true)
  }
  protected headerChecked() {
    return this.table.getIsAllRowsSelected()
      ? true
      : this.table.getIsSomeRowsSelected()
        ? ('indeterminate' as const)
        : false
  }
}
