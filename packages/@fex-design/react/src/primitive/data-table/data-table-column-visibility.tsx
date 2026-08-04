import {
  dataTableSrOnlyClassName,
  dataTableVisibilityItemClassName,
  dataTableVisibilityPanelClassName,
} from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { RowData, TableFeatures } from '@tanstack/react-table'
import type { FieldsetHTMLAttributes } from 'react'
import type { ReactTable } from '@tanstack/react-table'
import { DataTableCheckbox } from './data-table-checkbox'

export interface DataTableColumnVisibilityProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends FieldsetHTMLAttributes<HTMLFieldSetElement> {
  table: ReactTable<TFeatures, TData, unknown>
}

export function DataTableColumnVisibility<TFeatures extends TableFeatures, TData extends RowData>({
  table,
  className,
  ...props
}: DataTableColumnVisibilityProps<TFeatures, TData>) {
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
    <fieldset {...props} className={cn(dataTableVisibilityPanelClassName, className)}>
      <legend className={dataTableSrOnlyClassName}>Visible columns</legend>
      {visibilityTable
        .getAllLeafColumns()
        .filter((column) => column.getCanHide())
        .map((column) => (
          <label key={column.id} className={dataTableVisibilityItemClassName}>
            <DataTableCheckbox
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
