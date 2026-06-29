import { cva, type VariantProps } from 'class-variance-authority'

export const emptyClassName =
  'flex w-full min-w-0 flex-1 flex-col items-center justify-center gap-4 rounded-md border border-dashed border-border p-6 text-center text-balance'

export const emptyHeaderClassName = 'flex max-w-sm flex-col items-center gap-2'

export const emptyMediaClassName = cva(
  'mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-transparent',
        icon: 'size-8 rounded-md bg-muted-background text-foreground [&_svg:not([class*=size-])]:size-4',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const emptyTitleClassName = 'text-sm font-medium tracking-tight text-foreground'

export const emptyDescriptionClassName =
  'text-sm/relaxed text-muted-foreground [&>a]:underline [&>a]:underline-offset-4 [&>a:hover]:text-link'

export const emptyContentClassName =
  'flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance'

export type EmptyMediaStyleProps = VariantProps<typeof emptyMediaClassName>
