import { cva, type VariantProps } from 'class-variance-authority'
import { selectableItemSelectedClassName } from './selectable-item'

export const selectTriggerClassName = cva(
  [
    'flex min-h-9 w-full min-w-0 items-center gap-2 rounded-md border border-input-border bg-input-background py-1 pl-3 text-sm text-foreground outline-none',
    'focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20',
    'data-[status=error]:border-danger data-[status=error]:ring-2 data-[status=error]:ring-danger/20',
    'data-[status=warning]:border-warning data-[status=warning]:ring-2 data-[status=warning]:ring-warning/20',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
  ].join(' '),
  {
    variants: { size: { sm: 'min-h-8 pl-2 text-xs', md: 'min-h-9 pl-3 text-sm', lg: 'min-h-10 pl-3 text-base' } },
    defaultVariants: { size: 'md' },
  },
)
export const selectValueContainerClassName = 'flex min-w-0 flex-1 flex-wrap items-center gap-1.5'
export const selectValueClassName = 'contents'
export const selectInputClassName = 'min-w-8 flex-1 bg-transparent outline-none placeholder:text-muted-foreground'
export const selectPlaceholderClassName = 'truncate text-muted-foreground'
export const selectTagClassName = 'inline-flex h-6 max-w-full items-center gap-1 rounded-md bg-muted-background px-2 text-xs leading-none text-foreground'
export const selectTagRemoveClassName = '-mr-1 inline-flex size-4 items-center justify-center rounded-sm text-muted-foreground hover:bg-background hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary [&_svg]:size-3'
export const selectTagOverflowClassName = 'inline-flex h-6 shrink-0 items-center rounded-md bg-muted-background px-2 text-xs font-medium leading-none text-muted-foreground'
export const selectSuffixClassName = 'ml-auto inline-flex h-5 shrink-0 items-center justify-center pr-2.5 text-muted-foreground [&_svg]:size-4'
export const selectIndicatorClassName = 'inline-flex size-4 items-center justify-center transition-transform data-[state=open]:rotate-180'
export const selectClearClassName = 'size-4 px-0 py-0'
export const selectContentClassName = [
  'z-[var(--floating-z-index,50)] overflow-hidden rounded-md border border-border bg-popover-background text-popover-foreground shadow-lg [--popover-content-padding:0px]',
  'min-w-[var(--select-content-min-width,0px)]',
  'max-h-[min(var(--floating-available-height,calc(100vh-16px)),var(--select-content-max-height,320px))]',
].join(' ')
export const selectListClassName = 'max-h-[inherit] overflow-y-auto p-1 overscroll-contain outline-none'
export const selectOptionClassName = [
  'group/select-option relative flex min-h-[var(--select-option-height,32px)] cursor-default select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm outline-none transition-colors',
  'data-[active=true]:bg-muted-background data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50',
  selectableItemSelectedClassName,
].join(' ')
export const selectOptionLabelClassName = 'min-w-0 flex-1 truncate'
export const selectOptionIndicatorClassName = 'inline-flex size-4 shrink-0 items-center justify-center text-primary opacity-0 transition-opacity group-data-[selected=true]/select-option:opacity-100 [&_svg]:size-4'
export const selectGroupLabelClassName = 'px-2 py-1.5 text-xs font-medium text-muted-foreground'
export const selectEmptyClassName = 'px-3 py-6 text-center text-sm text-muted-foreground'
export const selectLoadingClassName = 'px-3 py-6 text-center text-sm text-muted-foreground'

export type SelectStyleProps = VariantProps<typeof selectTriggerClassName>
