export const mentionsRootClassName = 'relative block w-full'

export const mentionsContentClassName = [
  'z-[var(--floating-z-index,50)] w-full overflow-hidden rounded-md border border-border',
  'bg-popover-background text-popover-foreground shadow-lg',
  'max-h-[min(var(--floating-available-height,calc(100vh-16px)),var(--mentions-content-max-height,320px))]',
].join(' ')

export const mentionsListClassName =
  'block max-h-[inherit] overflow-y-auto p-1 overscroll-contain outline-none'

export const mentionsItemClassName = [
  'relative flex min-h-8 cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none',
  'hover:bg-muted-background data-[active=true]:bg-muted-background data-[selected=true]:bg-muted-background',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
].join(' ')

export const mentionsStateClassName =
  'flex min-h-20 items-center justify-center px-3 py-6 text-sm text-muted-foreground'
