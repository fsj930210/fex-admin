import { cva, type VariantProps } from 'class-variance-authority'

export const cascaderTriggerClassName = cva(
  [
    'flex min-h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input-border bg-input-background py-1 pl-3 text-sm text-foreground outline-none',
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    'data-[status=error]:border-danger data-[status=error]:ring-2 data-[status=error]:ring-danger/20',
    'data-[status=warning]:border-warning data-[status=warning]:ring-2 data-[status=warning]:ring-warning/20',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
  ].join(' '),
  {
    variants: {
      size: { sm: 'min-h-8 pl-2 text-xs', md: 'min-h-9 pl-3 text-sm', lg: 'min-h-10 pl-3 text-base' },
    },
    defaultVariants: { size: 'md' },
  },
)
export const cascaderValueContainerClassName = 'flex min-w-0 flex-1 flex-wrap items-center gap-1.5'
export const cascaderValueClassName = 'min-w-0 flex-1 truncate'
export const cascaderPlaceholderClassName = 'truncate text-muted-foreground'
export const cascaderInputClassName = 'min-w-8 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
export const cascaderTagClassName = 'inline-flex h-6 max-w-full items-center gap-1 rounded-md bg-muted-background px-2 text-xs leading-none'
export const cascaderTagRemoveClassName = '-mr-1 inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-background hover:text-foreground [&_svg]:size-3'
export const cascaderSuffixClassName = 'ml-auto inline-flex h-5 shrink-0 items-center justify-center pr-2.5 text-muted-foreground [&_svg]:size-4'
export const cascaderIndicatorClassName = 'inline-flex size-4 items-center justify-center transition-transform data-[state=open]:rotate-180'
export const cascaderClearClassName = 'size-4 px-0 py-0'
export const cascaderContentClassName = [
  'z-[var(--floating-z-index,50)] overflow-hidden rounded-md border border-border bg-popover-background text-popover-foreground shadow-lg [--popover-content-padding:0px]',
  'w-max min-w-[var(--cascader-content-min-width,var(--floating-reference-width))] [--popover-content-max-width:var(--cascader-content-max-width,var(--floating-available-width))]',
  'max-h-[min(var(--floating-available-height,calc(100vh-16px)),var(--cascader-content-max-height,320px))]',
].join(' ')
export const cascaderPanelClassName = 'flex h-[var(--cascader-panel-height,240px)] min-w-full w-max'
export const cascaderColumnClassName = 'h-full min-w-[min(var(--cascader-column-width,180px),var(--floating-reference-width),calc(var(--floating-available-width)/var(--cascader-column-count,1)))] flex-1 border-r border-border last:border-r-0'
export const cascaderColumnViewportClassName = 'h-full p-1'
export const cascaderOptionClassName = [
  'group/cascader-option flex min-h-8 cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
  'hover:bg-muted-background data-[active=true]:bg-muted-background data-[selected=true]:font-medium data-[selected=true]:text-primary',
  'data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
].join(' ')
export const cascaderOptionLabelClassName = 'min-w-0 flex-1 truncate'
export const cascaderOptionIconClassName = 'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground [&_svg]:size-4'
export const cascaderEmptyClassName = 'flex h-full min-w-56 items-center justify-center px-3 py-6 text-center text-sm text-muted-foreground'
export const cascaderLoadingClassName = 'inline-flex items-center gap-2 text-sm text-muted-foreground [&_svg]:size-4'

export function cascaderPanelHeight(itemCount: number): string {
  if (itemCount <= 0) return '96px'
  return `${Math.min(240, itemCount * 32 + 8)}px`
}

export type CascaderStyleProps = VariantProps<typeof cascaderTriggerClassName>
