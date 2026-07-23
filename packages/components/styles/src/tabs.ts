import { cva, type VariantProps } from 'class-variance-authority'

export const tabsListClassName = cva('inline-flex max-w-full items-center text-sm', {
  variants: {
    variant: {
      default: 'gap-0.5 rounded-md bg-muted-background p-0.5',
      line: 'gap-1 border-b border-border',
    },
    orientation: {
      horizontal: '',
      vertical: 'flex-col items-stretch border-b-0 border-r',
    },
  },
  defaultVariants: { variant: 'default', orientation: 'horizontal' },
})

export const tabsItemClassName = cva(
  [
    'inline-flex h-7 shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-md px-2.5 text-sm',
    'cursor-pointer select-none outline-none transition-colors',
    'focus-visible:ring-3 focus-visible:ring-focus/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'text-muted-foreground hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
        line: 'rounded-none border-b-2 border-transparent px-3 text-muted-foreground hover:text-foreground data-[state=active]:border-primary data-[state=active]:text-primary',
      },
    },
    defaultVariants: { variant: 'default' },
  },
)

export const tabsContentClassName = cva('mt-space-md rounded-md border border-border bg-card p-space-lg text-sm text-foreground', {
  variants: { variant: { default: '', line: 'border-0 bg-transparent p-0' } },
  defaultVariants: { variant: 'default' },
})

export const tabsCloseClassName = 'grid size-4 shrink-0 place-items-center rounded-sm text-muted-foreground hover:bg-hover-background hover:text-foreground'

export type TabsStyleProps = VariantProps<typeof tabsListClassName>
