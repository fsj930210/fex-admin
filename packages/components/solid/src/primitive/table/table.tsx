import { tableBodyClassName, tableCaptionClassName, tableCellClassName, tableClassName, tableContainerClassName, tableFooterClassName, tableHeadClassName, tableHeaderClassName, tableRowClassName } from '@fex/components-styles/table'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'

export function Table(props: ParentProps<JSX.TableHTMLAttributes<HTMLTableElement>>) {
  const [local, rest] = splitProps(props, ['class', 'children'])
  return <div data-slot="table-container" class={tableContainerClassName}><table {...rest} data-slot="table" class={cn(tableClassName, local.class)}>{local.children}</table></div>
}

function createPart<T extends HTMLElement>(tag: string, slot: string, className: string) {
  return function Part(props: ParentProps<JSX.HTMLAttributes<T>>) {
    const [local, rest] = splitProps(props, ['class', 'children'])
    const Tag = tag as keyof JSX.IntrinsicElements
    return <Tag {...rest} data-slot={slot} class={cn(className, local.class)}>{local.children}</Tag>
  }
}

export const TableHeader = createPart<HTMLTableSectionElement>('thead', 'table-header', tableHeaderClassName)
export const TableBody = createPart<HTMLTableSectionElement>('tbody', 'table-body', tableBodyClassName)
export const TableFooter = createPart<HTMLTableSectionElement>('tfoot', 'table-footer', tableFooterClassName)
export const TableRow = createPart<HTMLTableRowElement>('tr', 'table-row', tableRowClassName)
export const TableHead = createPart<HTMLTableCellElement>('th', 'table-head', tableHeadClassName)
export const TableCell = createPart<HTMLTableCellElement>('td', 'table-cell', tableCellClassName)
export const TableCaption = createPart<HTMLTableCaptionElement>('caption', 'table-caption', tableCaptionClassName)
