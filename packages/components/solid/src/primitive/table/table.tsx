import { tableBodyClassName, tableCaptionClassName, tableCellClassName, tableClassName, tableContainerClassName, tableFooterClassName, tableHeadClassName, tableHeaderClassName, tableRowClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

type TableSectionProps = ParentProps<JSX.HTMLAttributes<HTMLTableSectionElement>>
type TableRowProps = ParentProps<JSX.HTMLAttributes<HTMLTableRowElement>>
type TableCellProps = ParentProps<JSX.HTMLAttributes<HTMLTableCellElement>>
type TableCaptionProps = ParentProps<JSX.HTMLAttributes<HTMLTableCaptionElement>>

export function Table(props: ParentProps<JSX.HTMLAttributes<HTMLTableElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div data-slot="table-container" class={tableContainerClassName}><table {...rest} data-slot="table" class={cn(tableClassName, local.class)}>{local.children}</table></div>
}

export function TableHeader(props: TableSectionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <thead {...rest} data-slot="table-header" class={cn(tableHeaderClassName, local.class)}>{local.children}</thead>
}

export function TableBody(props: TableSectionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <tbody {...rest} data-slot="table-body" class={cn(tableBodyClassName, local.class)}>{local.children}</tbody>
}

export function TableFooter(props: TableSectionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <tfoot {...rest} data-slot="table-footer" class={cn(tableFooterClassName, local.class)}>{local.children}</tfoot>
}

export function TableRow(props: TableRowProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <tr {...rest} data-slot="table-row" class={cn(tableRowClassName, local.class)}>{local.children}</tr>
}

export function TableHead(props: TableCellProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <th {...rest} data-slot="table-head" class={cn(tableHeadClassName, local.class)}>{local.children}</th>
}

export function TableCell(props: TableCellProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <td {...rest} data-slot="table-cell" class={cn(tableCellClassName, local.class)}>{local.children}</td>
}

export function TableCaption(props: TableCaptionProps) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <caption {...rest} data-slot="table-caption" class={cn(tableCaptionClassName, local.class)}>{local.children}</caption>
}
