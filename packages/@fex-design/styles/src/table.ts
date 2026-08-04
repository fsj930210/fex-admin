export const tableContainerClassName = 'relative w-full overflow-x-auto'

export const tableClassName = 'w-full caption-bottom text-sm'

export const tableHeaderClassName = '[&_tr]:border-b'

export const tableBodyClassName = '[&_tr:last-child]:border-0'

export const tableFooterClassName =
  'border-t border-border bg-muted-background/50 font-medium [&>tr]:last:border-b-0'

export const tableRowClassName =
  'border-b border-border transition-colors hover:bg-muted-background/50 has-aria-expanded:bg-muted-background/50 data-[state=selected]:bg-muted-background'

export const tableHeadClassName =
  'h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0'

export const tableCellClassName =
  'p-2 align-middle whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0'

export const tableCaptionClassName = 'mt-4 text-sm text-muted-foreground'
