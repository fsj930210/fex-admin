import { cva, type VariantProps } from 'class-variance-authority'

export const collapseRootClassName = cva('w-full text-sm text-foreground', {
  variants: {
    variant: {
      outlined: 'overflow-hidden rounded-md border border-border bg-card-background',
      filled: 'space-y-space-sm',
      ghost: 'divide-y divide-border/70',
    },
    size: {
      sm: '[--collapse-trigger-padding:10px] [--collapse-content-padding:10px]',
      md: '[--collapse-trigger-padding:14px] [--collapse-content-padding:14px]',
      lg: '[--collapse-trigger-padding:18px] [--collapse-content-padding:18px]',
    },
  },
  defaultVariants: { variant: 'outlined', size: 'md' },
})

export const collapseItemClassName = cva('group/collapse-item', {
  variants: {
    variant: {
      outlined: 'border-b border-border last:border-b-0',
      filled: 'overflow-hidden rounded-md border border-border bg-muted-background/50',
      ghost: '',
    },
  },
  defaultVariants: { variant: 'outlined' },
})

export const collapseTriggerClassName = cva(
  [
    'group/collapse-trigger flex min-h-10 w-full items-center justify-between gap-space-sm',
    'rounded-none px-[var(--collapse-trigger-padding)] py-3 text-left font-normal',
    'data-[state=open]:text-foreground data-[state=closed]:text-foreground',
    'disabled:opacity-50',
  ].join(' '),
  {
    variants: {
      variant: {
        outlined: 'bg-muted-background/35 hover:bg-muted-background/70',
        filled: 'bg-muted-background/50 hover:bg-hover-background',
        ghost: 'bg-transparent hover:bg-hover-background/50',
      },
    },
    defaultVariants: { variant: 'outlined' },
  },
)

export const collapseIconClassName =
  'size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapse-trigger:-rotate-90'

export const collapseContentOuterClassName = [
  'grid overflow-hidden transition-[grid-template-rows,opacity] duration-200 ease-out',
  'data-[state=open]:grid-rows-[1fr] data-[state=open]:opacity-100',
  'data-[state=closed]:grid-rows-[0fr] data-[state=closed]:!h-0 data-[state=closed]:opacity-0',
].join(' ')

export const collapseContentInnerClassName = cva('min-h-0 overflow-hidden', {
  variants: {
    variant: {
      outlined:
        'bg-card-background px-[var(--collapse-content-padding)] py-4 data-[state=closed]:!p-0',
      filled:
        'px-[var(--collapse-content-padding)] py-4 data-[state=closed]:!p-0',
      ghost:
        'px-[var(--collapse-content-padding)] py-4 data-[state=closed]:!p-0',
    },
  },
  defaultVariants: { variant: 'outlined' },
})

export type CollapseStyleProps = VariantProps<typeof collapseRootClassName>
