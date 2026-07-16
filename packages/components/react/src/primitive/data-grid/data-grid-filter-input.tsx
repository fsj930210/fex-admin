import { dataGridInputClassName } from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { Input } from '../input/input'

export interface DataGridFilterInputProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  column: Column<TFeatures, TData>
}

export function DataGridFilterInput<TFeatures extends TableFeatures, TData extends RowData>({
  column,
  className,
  ...props
}: DataGridFilterInputProps<TFeatures, TData>) {
  const filterColumn = column as unknown as Column<TFeatures, TData> & {
    getFilterValue: () => unknown
    setFilterValue: (value: unknown) => void
  }
  return (
    <Input
      {...props}
      value={String(filterColumn.getFilterValue() ?? '')}
      className={cn(dataGridInputClassName, className)}
      onChange={(event) => filterColumn.setFilterValue(event.currentTarget.value)}
    />
  )
}
