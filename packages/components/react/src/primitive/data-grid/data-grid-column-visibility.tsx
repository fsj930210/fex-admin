import {
  dataGridSrOnlyClassName,
  dataGridVisibilityItemClassName,
  dataGridVisibilityPanelClassName,
} from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { RowData, TableFeatures } from '@tanstack/react-table'
import type { FieldsetHTMLAttributes } from 'react'
import type { ReactTable } from '@tanstack/react-table'
import { DataGridCheckbox } from './data-grid-checkbox'

export interface DataGridColumnVisibilityProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  table: ReactTable<TFeatures, TData, unknown>
}

export function DataGridColumnVisibility<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  className,
  ...props
}: DataGridColumnVisibilityProps<TFeatures, TData>) {
  const visibilityTable = table as unknown as {
    getAllLeafColumns: () => Array<{
      id: string
      columnDef: { header?: unknown }
      getCanHide: () => boolean
      getIsVisible: () => boolean
      toggleVisibility: (visible?: boolean) => void
    }>
  }
  return (
    <fieldset {...props} className={cn(dataGridVisibilityPanelClassName, className)}>
      <legend className={dataGridSrOnlyClassName}>Visible columns</legend>
      {visibilityTable.getAllLeafColumns().filter((column) => column.getCanHide()).map((column) => (
        <label key={column.id} className={dataGridVisibilityItemClassName}>
          <DataGridCheckbox
            checked={column.getIsVisible()}
            aria-label={`Toggle ${column.id} column`}
            onCheckedChange={(checked) => column.toggleVisibility(checked === true)}
          />
          {typeof column.columnDef.header === 'string' ? column.columnDef.header : column.id}
        </label>
      ))}
    </fieldset>
  )
}
