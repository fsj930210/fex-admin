import { cva } from 'class-variance-authority'

export const dataTableRootClassName = cva(
  'relative block w-full overflow-hidden rounded-md border border-border bg-background text-foreground',
  {
    variants: {
      density: {
        compact:
          '[--data-table-row-height:2rem] [&_th]:h-8 [&_th]:px-2 [&_td]:h-8 [&_td]:px-2 [&_td]:py-1',
        default:
          '[--data-table-row-height:2.5rem] [&_th]:h-10 [&_th]:px-3 [&_td]:h-10 [&_td]:px-3 [&_td]:py-2',
        comfortable:
          '[--data-table-row-height:3rem] [&_th]:h-12 [&_th]:px-4 [&_td]:h-12 [&_td]:px-4 [&_td]:py-3',
      },
      striped: {
        true: '[&_tbody_tr:nth-child(even)]:bg-muted-background/35',
        false: '',
      },
      bordered: {
        true: '[&_th]:border-e [&_th]:border-b [&_th]:border-border [&_td]:border-e [&_td]:border-b [&_td]:border-border [&_tr:last-child_td]:border-b-0 [&_th:last-child]:border-e-0 [&_td:last-child]:border-e-0',
        false: '',
      },
    },
    defaultVariants: { density: 'default', striped: false, bordered: false },
  },
)

export const dataTableViewportClassName = 'relative w-full overflow-auto'
export const dataTableClassName = 'w-full table-fixed border-collapse text-sm'
// Header typography belongs to the table part, rather than a renderer branch.
// Grouped and leaf header rows therefore share one cross-framework contract.
export const dataTableHeaderClassName =
  'sticky top-0 z-30 border-b border-border bg-muted-background text-foreground [&_th]:font-semibold [&_[data-slot=data-table-header-content]]:font-semibold'
export const dataTableHeaderRowClassName = cva('border-b border-border', {
  variants: {
    bordered: {
      true: '[&>th]:after:hidden',
      false: '',
    },
  },
  defaultVariants: { bordered: false },
})
export const dataTableHeaderSeparatorClassName =
  'after:pointer-events-none after:absolute after:inset-y-2 after:end-0 after:w-px after:bg-border after:content-[""]'
export const dataTableHeaderCellClassName =
  'relative select-none bg-muted-background text-left align-middle font-semibold whitespace-nowrap text-foreground'
export const dataTableHeaderContentClassName = 'min-w-0 overflow-hidden text-ellipsis font-semibold'
export const dataTableBodyClassName = 'bg-background text-foreground [&_tr:last-child]:border-b-0'
export const dataTableRowClassName =
  'border-b border-border transition-colors hover:bg-muted-background/50 data-[state=selected]:bg-muted-background'
// Row pinning is deliberately expressed once on the <tr>; its boundary shadow
// is supplied as one inline row style, never copied to every cell.
export const dataTablePinnedRowClassName =
  'sticky z-20 bg-background after:pointer-events-none after:absolute after:inset-x-0 after:z-30 after:h-8 after:content-[""] [&>td]:relative [&>td]:z-20 [&>td]:bg-background'
export const dataTablePinnedTopRowClassName = 'top-0'
export const dataTablePinnedBottomRowClassName = 'bottom-0'
// A single selector applies the directional layer boundary to the row cells.
// Renderers never duplicate per-cell shadow declarations.
export const dataTablePinnedTopEdgeClassName =
  'after:-bottom-8 after:shadow-[inset_0_10px_8px_-8px_rgb(15_23_42_/_0.18)]'
export const dataTablePinnedBottomEdgeClassName =
  'after:-top-8 after:shadow-[inset_0_-10px_8px_-8px_rgb(15_23_42_/_0.18)]'
export const dataTableGroupedRowClassName =
  'bg-muted-background/55 hover:bg-muted-background/70 [&>td]:p-0'
export const dataTableCellClassName =
  'relative align-middle font-normal whitespace-nowrap text-foreground'
export const dataTableCellContentClassName =
  'min-w-0 overflow-hidden text-ellipsis focus-within:overflow-visible'
export const dataTableEmptyClassName = 'h-32 text-center text-sm text-muted-foreground'
export const dataTableLoadingClassName =
  'absolute inset-0 z-30 grid place-items-center bg-background/70 text-sm text-muted-foreground backdrop-blur-[1px]'
export const dataTableToolbarClassName =
  'flex flex-wrap items-center justify-between gap-space-sm border-b border-border p-space-sm'
export const dataTableControlsClassName = 'flex flex-wrap items-center gap-space-sm'
export const dataTableButtonClassName =
  'inline-flex h-8 items-center justify-center gap-1 rounded-md border border-border bg-background px-2 text-sm hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
export const dataTableIconButtonClassName = `${dataTableButtonClassName} w-8 px-0`
export const dataTableInputClassName =
  'h-8 w-auto min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
export const dataTableInputRootClassName = 'h-8 w-auto min-w-0 flex-1 text-sm'
export const dataTableSelectClassName = dataTableInputClassName
export const dataTablePaginationClassName =
  'flex flex-wrap items-center justify-between gap-space-sm border-t border-border p-space-sm text-sm'
export const dataTablePaginationSummaryClassName = 'text-muted-foreground'
export const dataTableResizeHandleClassName =
  'absolute inset-y-0 end-0 z-40 w-2 appearance-none border-0 bg-transparent p-0 cursor-col-resize touch-none select-none before:absolute before:inset-y-2 before:end-0 before:w-px before:bg-border hover:before:bg-primary data-[resizing=true]:before:bg-primary'
export const dataTableSortButtonClassName =
  'inline-flex w-full items-center justify-between gap-2 text-left font-semibold outline-none'
export const dataTableVisibilityPanelClassName =
  'flex flex-wrap items-center gap-space-sm rounded-md border border-border p-space-sm'
export const dataTablePinnedCellClassName = 'sticky z-20 overflow-visible bg-background'
export const dataTablePinnedHeaderCellClassName = ''
export const dataTablePinnedStartClassName = ''
export const dataTablePinnedEndClassName = ''
// The divider belongs outside the fixed cell; clipping belongs to the inner
// content wrapper, so consumers can still override the cell's overflow.
export const dataTablePinnedStartEdgeClassName =
  'after:pointer-events-none after:absolute after:inset-y-0 after:-end-8 after:w-8 after:shadow-[inset_10px_0_8px_-8px_rgb(15_23_42_/_0.18)] after:content-[""]'
export const dataTablePinnedEndEdgeClassName =
  'after:pointer-events-none after:absolute after:inset-y-0 after:-start-8 after:w-8 after:shadow-[inset_-10px_0_8px_-8px_rgb(15_23_42_/_0.18)] after:content-[""]'
export const dataTableVirtualSpacerClassName = 'h-0 !border-0 !p-0'
export const dataTableAlignClassName = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const
export const dataTableSrOnlyClassName = 'sr-only'
export const dataTableVisibilityItemClassName = 'inline-flex items-center gap-2 text-sm'
