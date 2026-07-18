export const inputRootClassName = [
  'group/input-root flex h-8 w-full min-w-0 items-stretch overflow-hidden rounded-md border border-border bg-background text-foreground',
  'transition-colors focus-within:border-focus focus-within:ring-3 focus-within:ring-focus/50',
  'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:bg-disabled-background data-[disabled=true]:text-disabled-foreground data-[disabled=true]:opacity-70',
  'data-[invalid=true]:border-danger data-[invalid=true]:ring-3 data-[invalid=true]:ring-danger/20',
].join(' ')

export const inputControlClassName = [
  'min-w-0 flex-1 bg-transparent px-2.5 py-1 text-base text-foreground outline-none placeholder:text-placeholder-foreground md:text-sm',
  'disabled:cursor-not-allowed file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground',
].join(' ')

export const inputPrefixClassName = 'flex shrink-0 items-center pl-2.5 text-muted-foreground [&_svg]:size-4'
export const inputSuffixClassName = 'flex shrink-0 items-center pr-2.5 text-muted-foreground [&_svg]:size-4'

const inputAddonClassName = 'flex shrink-0 items-center bg-muted-background px-2.5 text-sm text-muted-foreground'

export const inputAddonBeforeClassName = `${inputAddonClassName} border-r border-border`
export const inputAddonAfterClassName = `${inputAddonClassName} border-l border-border`

export const inputClearClassName = [
  'flex shrink-0 items-center justify-center px-2 text-muted-foreground outline-none transition-colors hover:text-foreground',
  'focus-visible:bg-muted-background focus-visible:text-foreground disabled:pointer-events-none disabled:opacity-0 [&_svg]:size-4',
].join(' ')
