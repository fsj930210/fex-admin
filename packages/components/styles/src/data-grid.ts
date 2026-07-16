import { cva } from 'class-variance-authority'

export const dataGridRootClassName = cva(
  'relative block w-full overflow-hidden rounded-md border border-border bg-background text-foreground',
  {
    variants: {
      density: {
        compact: '[--data-grid-row-height:2rem] [&_th]:h-8 [&_th]:px-2 [&_td]:h-8 [&_td]:px-2 [&_td]:py-1',
        default: '[--data-grid-row-height:2.5rem] [&_th]:h-10 [&_th]:px-3 [&_td]:h-10 [&_td]:px-3 [&_td]:py-2',
        comfortable: '[--data-grid-row-height:3rem] [&_th]:h-12 [&_th]:px-4 [&_td]:h-12 [&_td]:px-4 [&_td]:py-3',
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

export const dataGridViewportClassName = 'relative w-full overflow-auto'
export const dataGridTableClassName = 'w-full table-fixed border-collapse text-sm'
// Header typography belongs to the table part, rather than a renderer branch.
// Grouped and leaf header rows therefore share one cross-framework contract.
export const dataGridHeaderClassName =
  'sticky top-0 z-30 border-b border-border bg-muted-background text-foreground [&_th]:font-semibold [&_[data-slot=data-grid-header-content]]:font-semibold'
export const dataGridHeaderRowClassName = cva(
  'border-b border-border',
  {
    variants: {
      bordered: {
        true: '[&>th]:after:hidden',
        false: '',
      },
    },
    defaultVariants: { bordered: false },
  },
)
export const dataGridHeaderSeparatorClassName =
  'after:pointer-events-none after:absolute after:inset-y-2 after:end-0 after:w-px after:bg-border after:content-[""]'
export const dataGridHeaderCellClassName =
  'relative select-none bg-muted-background text-left align-middle font-semibold whitespace-nowrap text-foreground'
export const dataGridHeaderContentClassName =
  'min-w-0 overflow-hidden text-ellipsis font-semibold'
export const dataGridBodyClassName = 'bg-background text-foreground [&_tr:last-child]:border-b-0'
export const dataGridRowClassName =
  'border-b border-border transition-colors hover:bg-muted-background/50 data-[state=selected]:bg-muted-background'
// Row pinning is deliberately expressed once on the <tr>; its boundary shadow
// is supplied as one inline row style, never copied to every cell.
export const dataGridPinnedRowClassName =
  'sticky z-20 bg-background after:pointer-events-none after:absolute after:inset-x-0 after:z-30 after:h-8 after:content-[""] [&>td]:relative [&>td]:z-20 [&>td]:bg-background'
export const dataGridPinnedTopRowClassName = 'top-0'
export const dataGridPinnedBottomRowClassName = 'bottom-0'
// A single selector applies the directional layer boundary to the row cells.
// Renderers never duplicate per-cell shadow declarations.
export const dataGridPinnedTopEdgeClassName =
  'after:-bottom-8 after:shadow-[inset_0_10px_8px_-8px_rgb(15_23_42_/_0.18)]'
export const dataGridPinnedBottomEdgeClassName =
  'after:-top-8 after:shadow-[inset_0_-10px_8px_-8px_rgb(15_23_42_/_0.18)]'
export const dataGridGroupedRowClassName = 'bg-muted-background/55 hover:bg-muted-background/70 [&>td]:p-0'
export const dataGridCellClassName = 'relative align-middle font-normal whitespace-nowrap text-foreground'
export const dataGridCellContentClassName =
  'min-w-0 overflow-hidden text-ellipsis focus-within:overflow-visible'
export const dataGridEmptyClassName = 'h-32 text-center text-sm text-muted-foreground'
export const dataGridLoadingClassName =
  'absolute inset-0 z-30 grid place-items-center bg-background/70 text-sm text-muted-foreground backdrop-blur-[1px]'
export const dataGridToolbarClassName =
  'flex flex-wrap items-center justify-between gap-space-sm border-b border-border p-space-sm'
export const dataGridControlsClassName = 'flex flex-wrap items-center gap-space-sm'
export const dataGridButtonClassName =
  'inline-flex h-8 items-center justify-center gap-1 rounded-md border border-border bg-background px-2 text-sm hover:bg-muted-background disabled:pointer-events-none disabled:opacity-50'
export const dataGridIconButtonClassName = `${dataGridButtonClassName} w-8 px-0`
export const dataGridInputClassName =
  'h-8 w-auto min-w-0 flex-1 rounded-md border border-border bg-background px-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring'
export const dataGridSelectClassName = dataGridInputClassName
export const dataGridPaginationClassName =
  'flex flex-wrap items-center justify-between gap-space-sm border-t border-border p-space-sm text-sm'
export const dataGridPaginationSummaryClassName = 'text-muted-foreground'
export const dataGridResizeHandleClassName =
  'absolute inset-y-0 end-0 z-40 w-2 appearance-none border-0 bg-transparent p-0 cursor-col-resize touch-none select-none before:absolute before:inset-y-2 before:end-0 before:w-px before:bg-border hover:before:bg-primary data-[resizing=true]:before:bg-primary'
export const dataGridSortButtonClassName =
  'inline-flex w-full items-center justify-between gap-2 text-left font-semibold outline-none'
export const dataGridVisibilityPanelClassName =
  'flex flex-wrap items-center gap-space-sm rounded-md border border-border p-space-sm'
export const dataGridPinnedCellClassName = 'sticky z-20 overflow-visible bg-background'
export const dataGridPinnedHeaderCellClassName = ''
export const dataGridPinnedStartClassName = ''
export const dataGridPinnedEndClassName = ''
// The divider belongs outside the fixed cell; clipping belongs to the inner
// content wrapper, so consumers can still override the cell's overflow.
export const dataGridPinnedStartEdgeClassName =
  'after:pointer-events-none after:absolute after:inset-y-0 after:-end-8 after:w-8 after:shadow-[inset_10px_0_8px_-8px_rgb(15_23_42_/_0.18)] after:content-[""]'
export const dataGridPinnedEndEdgeClassName =
  'after:pointer-events-none after:absolute after:inset-y-0 after:-start-8 after:w-8 after:shadow-[inset_-10px_0_8px_-8px_rgb(15_23_42_/_0.18)] after:content-[""]'
export const dataGridVirtualSpacerClassName = 'h-0 !border-0 !p-0'
export const dataGridAlignClassName = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const
export const dataGridSrOnlyClassName = 'sr-only'
export const dataGridVisibilityItemClassName = 'inline-flex items-center gap-2 text-sm'
