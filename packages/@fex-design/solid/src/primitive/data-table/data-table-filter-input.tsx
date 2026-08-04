import { dataTableInputRootClassName } from '@fex-design/styles/data-table'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
import { splitProps, type JSX } from 'solid-js'
import { InputControl, InputRoot } from '../input/input'

interface FilterableColumn {
  getFilterValue: () => unknown
  setFilterValue: (value: unknown) => void
}

export interface DataTableFilterInputProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onInput'> {
  column: Column<TFeatures, TData>
}

export function DataTableFilterInput<TFeatures extends TableFeatures, TData extends RowData>(
  props: DataTableFilterInputProps<TFeatures, TData>,
) {
  const [local, rest] = splitProps(props, ['column', 'class'])
  const column = local.column as unknown as FilterableColumn
  return (
    <InputRoot
      value={String(column.getFilterValue() ?? '')}
      class={cn(dataTableInputRootClassName, local.class)}
    >
      <InputControl
        {...rest}
        onInput={(event) => column.setFilterValue(event.currentTarget.value)}
      />
    </InputRoot>
  )
}
