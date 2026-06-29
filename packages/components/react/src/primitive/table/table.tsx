import {
  tableBodyClassName,
  tableCaptionClassName,
  tableCellClassName,
  tableClassName,
  tableContainerClassName,
  tableFooterClassName,
  tableHeadClassName,
  tableHeaderClassName,
  tableRowClassName,
} from '@fex/components-styles/table'
import { cn } from '@fex/utils'
import type { ComponentProps } from 'react'

export function Table({ className, ...props }: ComponentProps<'table'>) {
  return (
    <div data-slot="table-container" className={tableContainerClassName}>
      <table data-slot="table" className={cn(tableClassName, className)} {...props} />
    </div>
  )
}

export function TableHeader({ className, ...props }: ComponentProps<'thead'>) {
  return (
    <thead data-slot="table-header" className={cn(tableHeaderClassName, className)} {...props} />
  )
}

export function TableBody({ className, ...props }: ComponentProps<'tbody'>) {
  return <tbody data-slot="table-body" className={cn(tableBodyClassName, className)} {...props} />
}

export function TableFooter({ className, ...props }: ComponentProps<'tfoot'>) {
  return (
    <tfoot data-slot="table-footer" className={cn(tableFooterClassName, className)} {...props} />
  )
}

export function TableRow({ className, ...props }: ComponentProps<'tr'>) {
  return <tr data-slot="table-row" className={cn(tableRowClassName, className)} {...props} />
}

export function TableHead({ className, ...props }: ComponentProps<'th'>) {
  return <th data-slot="table-head" className={cn(tableHeadClassName, className)} {...props} />
}

export function TableCell({ className, ...props }: ComponentProps<'td'>) {
  return <td data-slot="table-cell" className={cn(tableCellClassName, className)} {...props} />
}

export function TableCaption({ className, ...props }: ComponentProps<'caption'>) {
  return (
    <caption
      data-slot="table-caption"
      className={cn(tableCaptionClassName, className)}
      {...props}
    />
  )
}
