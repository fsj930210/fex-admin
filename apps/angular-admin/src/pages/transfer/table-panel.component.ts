import { ChangeDetectionStrategy, Component, effect, input } from '@angular/core'
import { rowSelectionFeature } from '@fex/components-core/data-grid/features/row-selection'
import type { DataGridColumnMeta } from '@fex/components-core/data-grid/types'
import type { TransferPanelApi } from '@fex/components-angular/primitive/transfer'
import {
  DataGrid,
  DataGridCellTemplate,
  DataGridHeaderTemplate,
  tableFeatures,
  type Cell,
  type ColumnDef,
  type Header,
} from '@fex/components-angular/primitive/data-grid'
import { createDataGridTable } from '@fex/components-angular/signals/create-data-grid-table'
import { Checkbox } from '@fex/components-angular/ui/checkbox'
import type { TransferMember } from './data'

const modules = { rowSelectionFeature }
type Features = typeof modules & { columnMeta: DataGridColumnMeta<Features, TransferMember> }
type SelectionTable = ReturnType<typeof createDataGridTable<Features, TransferMember>> & {
  getIsAllRowsSelected(): boolean
  getIsSomeRowsSelected(): boolean
  toggleAllRowsSelected(value?: boolean): void
}

@Component({
  selector: 'fex-transfer-table-panel',
  standalone: true,
  imports: [DataGrid, DataGridCellTemplate, DataGridHeaderTemplate, Checkbox],
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
  protected readonly table = createDataGridTable({
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
      this.table.setDataGridOptions({
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
