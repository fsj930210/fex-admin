import { dataGridSortButtonClassName } from '@fex/components-styles/data-grid'
import { cn } from '@fex/utils'
import type { Column, RowData, TableFeatures } from '@tanstack/react-table'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '../../icon/chevron'
import { Button } from '../../ui/button/button'

export interface DataGridSortButtonProps<
  TFeatures extends TableFeatures,
  TData extends RowData,
> extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  column: Column<TFeatures, TData>
  children?: ReactNode
}

export function DataGridSortButton<TFeatures extends TableFeatures, TData extends RowData>({
  column,
  children,
  className,
  onClick,
  ...props
}: DataGridSortButtonProps<TFeatures, TData>) {
  const sortColumn = column as unknown as Column<TFeatures, TData> & {
    getCanSort: () => boolean
    getIsSorted: () => false | 'asc' | 'desc'
    getSortIndex: () => number
    getToggleSortingHandler: () => ((event: unknown) => void) | undefined
  }
  const direction = sortColumn.getIsSorted()
  const sortIndex = sortColumn.getSortIndex()
  return (
    <Button
      {...props}
      type="button"
      variant="ghost"
      disabled={!sortColumn.getCanSort()}
      aria-pressed={Boolean(direction)}
      className={cn(dataGridSortButtonClassName, className)}
      onClick={(event) => {
        onClick?.(event)
        if (!event.defaultPrevented) sortColumn.getToggleSortingHandler()?.(event)
      }}
    >
      <span>{children}</span>
      <span className="inline-flex items-center" aria-hidden>
        {direction === 'asc' ? <ChevronUpIcon className="size-3.5" /> : direction === 'desc' ? <ChevronDownIcon className="size-3.5" /> : <span className="relative inline-block size-3.5"><ChevronUpIcon className="absolute inset-x-0 top-0 size-3" /><ChevronDownIcon className="absolute inset-x-0 bottom-0 size-3" /></span>}
        {direction && sortIndex >= 0 ? <sup>{sortIndex + 1}</sup> : null}
      </span>
    </Button>
  )
}
