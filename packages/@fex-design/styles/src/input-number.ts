export const inputNumberActionsClassName =
  'flex h-full w-6 shrink-0 flex-col items-stretch gap-0 overflow-hidden border-l border-border !pr-0'

export const inputNumberActionClassName = [
  'flex min-h-0 flex-1 cursor-pointer select-none items-center justify-center border-0 bg-transparent p-0 text-muted-foreground outline-none transition-colors',
  'hover:bg-muted-background hover:text-foreground focus-visible:bg-muted-background focus-visible:text-foreground',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:!size-3.5',
].join(' ')

export const inputNumberDecrementClassName = inputNumberActionClassName
export const inputNumberIncrementClassName = `${inputNumberActionClassName} border-b border-border`
