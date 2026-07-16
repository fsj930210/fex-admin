import { dataGridVisibilityItemClassName, dataGridVisibilityPanelClassName } from '@fex/components-styles/data-grid'
import { For, splitProps, type JSX } from 'solid-js'
import type { RowData, TableFeatures } from '@tanstack/table-core'
import type { SolidDataGridTable } from '../../primitives/create-data-grid-table'
import { DataGridCheckbox } from './data-grid-checkbox'

interface VisibilityColumn { id: string; getCanHide: () => boolean; getIsVisible: () => boolean; toggleVisibility: (visible: boolean) => void }
interface VisibilityTable { getAllLeafColumns: () => readonly VisibilityColumn[] }

export interface DataGridColumnVisibilityProps<TFeatures extends TableFeatures, TData extends RowData> extends JSX.HTMLAttributes<HTMLDivElement> { table: SolidDataGridTable<TFeatures, TData> }

export function DataGridColumnVisibility<TFeatures extends TableFeatures, TData extends RowData>(props: DataGridColumnVisibilityProps<TFeatures, TData>) {
  const [local, rest] = splitProps(props, ['table'])
  const table = local.table as unknown as VisibilityTable
  const columns = () => {
    local.table.dataGridSnapshot()
    return table.getAllLeafColumns().filter((column) => column.getCanHide())
  }
  return <div {...rest} class={dataGridVisibilityPanelClassName}><For each={columns()}>{(column) => <label class={dataGridVisibilityItemClassName}><DataGridCheckbox checked={(local.table.dataGridSnapshot(), column.getIsVisible())} onCheckedChange={(checked) => column.toggleVisibility(checked === true)} /><span>{column.id}</span></label>}</For></div>
}
