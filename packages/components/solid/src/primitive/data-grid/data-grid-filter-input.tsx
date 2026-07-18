import { dataGridInputRootClassName } from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
import { splitProps, type JSX } from 'solid-js'
import { InputControl, InputRoot } from '../input/input'

interface FilterableColumn {
  getFilterValue: () => unknown
  setFilterValue: (value: unknown) => void
}

export interface DataGridFilterInputProps<TFeatures extends TableFeatures, TData extends RowData>
  extends Omit<JSX.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onInput'> {
  column: Column<TFeatures, TData>
}

export function DataGridFilterInput<TFeatures extends TableFeatures, TData extends RowData>(props: DataGridFilterInputProps<TFeatures, TData>) {
  const [local, rest] = splitProps(props, ['column', 'class'])
  const column = local.column as unknown as FilterableColumn
  return <InputRoot value={String(column.getFilterValue() ?? '')} class={cn(dataGridInputRootClassName, local.class)}><InputControl {...rest} onInput={(event) => column.setFilterValue(event.currentTarget.value)} /></InputRoot>
}
