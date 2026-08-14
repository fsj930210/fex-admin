import { cva, type VariantProps } from 'class-variance-authority'
import { toggleClassName } from './toggle'

export const bubbleClassName = cva(
  'group/bubble relative flex w-full min-w-0 flex-col data-[side=start]:items-start data-[side=end]:items-end',
  { variants: { size: { sm: '', md: '', lg: '' } }, defaultVariants: { size: 'md' } },
)

export const bubbleContentClassName = cva([
  'min-w-0 max-w-[var(--bubble-max-width,min(80%,42rem))] whitespace-pre-wrap break-words',
  'rounded-[var(--bubble-radius,var(--radius-md))] border text-sm leading-relaxed',
  'focus-visible:border-focus focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-focus/50',
].join(' '), {
  variants: {
    variant: {
      solid: 'border-transparent bg-[var(--bubble-background,var(--primary))] text-[var(--bubble-foreground,var(--primary-foreground))]',
      soft: 'border-transparent bg-[var(--bubble-background,var(--muted-background))] text-[var(--bubble-foreground,var(--foreground))]',
      outline: 'border-[var(--bubble-border,var(--border))] bg-[var(--bubble-background,var(--background))] text-[var(--bubble-foreground,var(--foreground))]',
      plain: 'max-w-full border-transparent bg-transparent p-0 text-[var(--bubble-foreground,var(--foreground))]',
      danger: 'border-danger/20 bg-[var(--bubble-background,color-mix(in_srgb,var(--danger)_10%,transparent))] text-[var(--bubble-foreground,var(--danger))]',
    },
    size: {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2',
      lg: 'px-4 py-3 text-base',
    },
  },
  compoundVariants: [
    { variant: 'plain', size: 'sm', class: 'p-0' },
    { variant: 'plain', size: 'md', class: 'p-0' },
    { variant: 'plain', size: 'lg', class: 'p-0' },
  ],
  defaultVariants: { variant: 'soft', size: 'md' },
})

export const bubbleGroupClassName = cva(
  'flex w-full min-w-0 flex-col data-[side=start]:items-start data-[side=end]:items-end [&>[data-slot=bubble]]:w-full',
  { variants: { spacing: { compact: 'gap-1', default: 'gap-2' } }, defaultVariants: { spacing: 'default' } },
)

export const bubbleActionsClassName = cva([
  'flex w-fit items-center gap-0.5 text-muted-foreground transition-opacity',
  'data-[align=start]:justify-start data-[align=end]:justify-end',
  'data-[visibility=interaction]:opacity-0 group-hover/bubble:opacity-100 group-focus-within/bubble:opacity-100',
  'max-[768px]:data-[visibility=interaction]:opacity-100 motion-reduce:transition-none',
].join(' '), {
  variants: { side: { top: 'order-first mb-1', bottom: 'order-last mt-1' } },
  defaultVariants: { side: 'bottom' },
})

export const bubbleActionClassName = (options?: Parameters<typeof toggleClassName>[0]) =>
  `${toggleClassName({ variant: 'default', size: 'sm', ...options })} h-7 border-0 bg-transparent px-2 shadow-none`

export const bubbleReactionsClassName = cva(
  'absolute z-10 flex w-fit items-center gap-0.5 rounded-full bg-background px-1 py-0.5 data-[align=start]:left-2 data-[align=end]:right-2',
  { variants: { side: { top: 'top-0 -translate-y-1/2', bottom: 'bottom-0 translate-y-1/2' } }, defaultVariants: { side: 'bottom' } },
)

export const bubbleReactionClassName = (options?: Parameters<typeof toggleClassName>[0]) =>
  `${toggleClassName({ variant: 'default', size: 'sm', ...options })} h-6 min-w-6 rounded-full border-0 bg-muted-background px-1.5 text-xs shadow-none`

export const bubbleReactionCountClassName = 'tabular-nums text-[0.7rem] text-muted-foreground'

export type BubbleStyleProps = VariantProps<typeof bubbleClassName>
export type BubbleContentStyleProps = VariantProps<typeof bubbleContentClassName>
export type BubbleGroupStyleProps = VariantProps<typeof bubbleGroupClassName>
export type BubbleActionsStyleProps = VariantProps<typeof bubbleActionsClassName>
export type BubbleReactionsStyleProps = VariantProps<typeof bubbleReactionsClassName>
