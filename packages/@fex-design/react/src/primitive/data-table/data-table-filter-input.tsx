import { dataTableInputRootClassName } from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { InputControl, InputRoot } from '../input/input'

export interface DataTableFilterInputProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  column: Column<TFeatures, TData>
}

export function DataTableFilterInput<TFeatures extends TableFeatures, TData extends RowData>({
  column,
  className,
  ...props
}: DataTableFilterInputProps<TFeatures, TData>) {
  const filterColumn = column as unknown as Column<TFeatures, TData> & {
    getFilterValue: () => unknown
    setFilterValue: (value: unknown) => void
  }
  return (
    <InputRoot
      value={String(filterColumn.getFilterValue() ?? '')}
      className={cn(dataTableInputRootClassName, className)}
    >
      <InputControl
        {...props}
        onChange={(event) => filterColumn.setFilterValue(event.currentTarget.value)}
      />
    </InputRoot>
  )
}
