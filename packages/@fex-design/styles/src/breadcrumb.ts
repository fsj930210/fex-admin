import { cva } from 'class-variance-authority'

const breadcrumbBase = 'text-sm text-muted-foreground'

export const breadcrumbClassName = cva(breadcrumbBase, {
  variants: { orientation: { horizontal: 'w-full', vertical: 'w-full' } },
  defaultVariants: { orientation: 'horizontal' },
})

export const breadcrumbListClassName = 'flex flex-wrap items-center gap-1.5 break-words'
export const breadcrumbItemClassName = 'inline-flex items-center gap-1.5'
export const breadcrumbLinkClassName = 'transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus/50 rounded-sm'
export const breadcrumbPageClassName = 'font-normal text-foreground'
export const breadcrumbSeparatorClassName = 'shrink-0 text-muted-foreground/60'
export const breadcrumbEllipsisClassName = 'inline-flex size-7 items-center justify-center rounded-md hover:bg-muted-background'
