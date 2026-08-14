export const inputNumberActionsClassName =
  'pointer-events-none flex h-full w-5 shrink-0 flex-col items-stretch gap-0 overflow-hidden border-l border-transparent opacity-0 !pr-0 transition-opacity group-hover/input-root:pointer-events-auto group-hover/input-root:border-border group-hover/input-root:opacity-100 group-focus-within/input-root:pointer-events-auto group-focus-within/input-root:border-border group-focus-within/input-root:opacity-100'

export const inputNumberActionClassName = [
  'flex min-h-0 flex-1 cursor-pointer select-none items-center justify-center border-0 bg-transparent p-0 text-muted-foreground outline-none transition-colors',
  'hover:bg-muted-background hover:text-foreground focus-visible:bg-muted-background focus-visible:text-foreground',
  'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 [&_svg]:!size-2.5',
].join(' ')

export const inputNumberDecrementClassName = inputNumberActionClassName
export const inputNumberIncrementClassName = `${inputNumberActionClassName} border-b border-border`
