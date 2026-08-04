import { cva, type VariantProps } from 'class-variance-authority'

export const badgeClassName = cva(
  [
    'inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full',
    'border border-transparent px-2 py-0.5 text-xs font-medium whitespace-nowrap',
    'transition-[color,box-shadow]',
    'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
    'aria-invalid:border-danger aria-invalid:ring-danger/20',
    '[&>svg]:pointer-events-none [&>svg]:size-3',
  ].join(' '),
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground [a&]:hover:bg-primary/80',
        secondary: 'bg-secondary-background text-foreground [a&]:hover:bg-hover-background',
        destructive: 'bg-danger text-danger-foreground [a&]:hover:bg-danger/90',
        outline: 'border-border text-foreground [a&]:hover:bg-muted-background',
        ghost: 'text-foreground [a&]:hover:bg-muted-background',
        link: 'text-link underline-offset-4 [a&]:hover:text-link-hover [a&]:hover:underline',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export type BadgeStyleProps = VariantProps<typeof badgeClassName>
