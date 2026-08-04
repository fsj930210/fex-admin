import {
  dataTableVisibilityItemClassName,
  dataTableVisibilityPanelClassName,
} from '@fex-design/styles/data-table'
import { For, splitProps, type JSX } from 'solid-js'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import type { SolidDataTable } from '../../primitives/create-data-table'
import { DataTableCheckbox } from './data-table-checkbox'

interface VisibilityColumn {
  id: string
  getCanHide: () => boolean
  getIsVisible: () => boolean
  toggleVisibility: (visible: boolean) => void
}
interface VisibilityTable {
  getAllLeafColumns: () => readonly VisibilityColumn[]
}

export interface DataTableColumnVisibilityProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends JSX.HTMLAttributes<HTMLDivElement> {
  table: SolidDataTable<TFeatures, TData>
}

export function DataTableColumnVisibility<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataTableColumnVisibilityProps<TFeatures, TData>,
) {
  const [local, rest] = splitProps(props, ['table'])
  const table = local.table as unknown as VisibilityTable
  const columns = () => {
    local.table.dataTableSnapshot()
    return table.getAllLeafColumns().filter((column) => column.getCanHide())
  }
  const isVisible = (column: VisibilityColumn) => {
    local.table.dataTableSnapshot()
    return column.getIsVisible()
  }
  return (
    <div {...rest} class={dataTableVisibilityPanelClassName}>
      <For each={columns()}>
        {(column) => (
          <label class={dataTableVisibilityItemClassName}>
            <DataTableCheckbox
              checked={isVisible(column)}
              onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
            />
            <span>{column.id}</span>
          </label>
        )}
      </For>
    </div>
  )
}
