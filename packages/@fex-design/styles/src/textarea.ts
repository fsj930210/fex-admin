export const textareaRootClassName = [
  'group/textarea-root relative flex w-full min-w-0 flex-col overflow-hidden rounded-md border border-border bg-background text-foreground',
  'transition-colors focus-within:border-focus focus-within:ring-3 focus-within:ring-focus/50',
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-disabled-background data-[disabled=true]:text-disabled-foreground data-[disabled=true]:opacity-70',
  'data-[invalid=true]:border-danger data-[invalid=true]:ring-3 data-[invalid=true]:ring-danger/20',
  'data-[status=error]:border-danger data-[status=error]:ring-3 data-[status=error]:ring-danger/20',
  'data-[status=warning]:border-warning data-[status=warning]:ring-3 data-[status=warning]:ring-warning/20',
].join(' ')

export const textareaInputClassName = [
  'block min-h-16 w-full resize-y bg-transparent px-2.5 py-2 text-base text-foreground outline-none',
  'placeholder:text-placeholder-foreground md:text-sm',
  'disabled:cursor-not-allowed disabled:text-disabled-foreground',
  'in-data-[slot=textarea-root]:resize-none',
].join(' ')

export const textareaFooterClassName = [
  'flex min-h-9 items-center justify-between gap-2 px-2 py-1.5 text-sm text-muted-foreground',
].join(' ')

export const textareaClearClassName = [
  'absolute right-2 top-2 z-10 inline-flex size-6 shrink-0 items-center justify-center rounded-md',
  'text-muted-foreground outline-none transition-colors hover:bg-muted-background hover:text-foreground',
  'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
  'disabled:pointer-events-none disabled:opacity-0 [&_svg]:size-4',
].join(' ')
