export const autoCompleteContentClassName = [
  'z-[var(--floating-z-index,50)] overflow-hidden rounded-md border border-border',
  'bg-popover-background text-popover-foreground shadow-lg [--popover-content-padding:0px]',
  'max-h-[min(var(--floating-available-height,calc(100vh-16px)),var(--auto-complete-content-max-height,320px))]',
].join(' ')

export const autoCompleteListClassName =
  'max-h-[inherit] overflow-y-auto p-1 overscroll-contain outline-none'

export const autoCompleteOptionClassName = [
  'relative flex min-h-8 cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none',
  'data-[active=true]:bg-muted-background data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
].join(' ')

export const autoCompleteStateClassName =
  'flex min-h-20 items-center justify-center px-3 py-6 text-sm text-muted-foreground'
