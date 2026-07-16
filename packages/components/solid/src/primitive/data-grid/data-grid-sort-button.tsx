import { dataGridSortButtonClassName } from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/table-core'
import { splitProps, type JSX, type ParentProps } from 'solid-js'
import { ChevronDownIcon, ChevronUpIcon } from '../../icon/chevron'
import { Button } from '../../ui/button/button'

interface SortableColumn {
  getCanSort: () => boolean
  getIsSorted: () => false | 'asc' | 'desc'
  getSortIndex: () => number
  getToggleSortingHandler: () => ((event: unknown) => void) | undefined
}

export interface DataGridSortButtonProps<TFeatures extends TableFeatures, TData extends RowData>
  extends ParentProps<Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, 'children'>> {
  column: Column<TFeatures, TData>
}

export function DataGridSortButton<TFeatures extends TableFeatures, TData extends RowData>(props: DataGridSortButtonProps<TFeatures, TData>) {
  const [local, rest] = splitProps(props, ['column', 'children', 'class', 'onClick'])
  const column = local.column as unknown as SortableColumn
  const direction = () => column.getIsSorted()
  return (
    <Button
      {...rest}
      variant="ghost"
      disabled={!column.getCanSort()}
      aria-pressed={Boolean(direction())}
      class={cn(dataGridSortButtonClassName, local.class)}
      onClick={(event) => {
        if (typeof local.onClick === 'function') local.onClick(event)
        if (!event.defaultPrevented) column.getToggleSortingHandler()?.(event)
      }}
    >
      <span>{local.children}</span>
      <span class="inline-flex items-center" aria-hidden>{direction() === 'asc' ? <ChevronUpIcon class="size-3.5" /> : direction() === 'desc' ? <ChevronDownIcon class="size-3.5" /> : <span class="relative inline-block size-3.5"><ChevronUpIcon class="absolute inset-x-0 top-0 size-3" /><ChevronDownIcon class="absolute inset-x-0 bottom-0 size-3" /></span>}{direction() && column.getSortIndex() >= 0 ? <sup>{column.getSortIndex() + 1}</sup> : null}</span>
    </Button>
  )
}
