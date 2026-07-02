import { cva, type VariantProps } from 'class-variance-authority'

export const popoverContentClassName = cva(
  [
    'z-[var(--floating-z-index,50)] min-w-32 max-h-[var(--floating-available-height,calc(100vh-16px))] max-w-[min(var(--floating-available-width,calc(100vw-16px)),var(--popover-content-max-width,360px))] overflow-visible',
    'rounded-md border border-border bg-popover-background p-[var(--popover-content-padding,12px)] text-sm text-popover-foreground shadow-lg outline-none',
    'origin-[var(--floating-transform-origin)] will-change-[opacity,transform]',
    'transition-[opacity,transform] duration-[var(--popover-motion-duration,140ms)] ease-[var(--popover-motion-ease,cubic-bezier(0.2,0,0,1))]',
    'data-[state=open]:scale-100 data-[state=open]:opacity-100',
    'data-[phase=closing]:pointer-events-none data-[phase=closing]:scale-95 data-[phase=closing]:opacity-0',
    'data-[state=closed]:pointer-events-none data-[state=closed]:scale-95 data-[state=closed]:opacity-0',
  ].join(' '),
  {
    variants: {
      size: {
        sm: '[--popover-content-padding:8px] [--popover-content-max-width:280px]',
        md: '[--popover-content-padding:12px] [--popover-content-max-width:360px]',
        lg: '[--popover-content-padding:16px] [--popover-content-max-width:480px]',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export const popoverArrowClassName = [
  'pointer-events-none absolute size-3 bg-popover-background',
  'data-[side=top]:-bottom-1.5 data-[side=top]:border-b data-[side=top]:border-r data-[side=top]:border-border',
  'data-[side=bottom]:-top-1.5 data-[side=bottom]:border-l data-[side=bottom]:border-t data-[side=bottom]:border-border',
  'data-[side=left]:-right-1.5 data-[side=left]:border-r data-[side=left]:border-t data-[side=left]:border-border',
  'data-[side=right]:-left-1.5 data-[side=right]:border-b data-[side=right]:border-l data-[side=right]:border-border',
  'data-[side=top]:-translate-x-1/2 data-[side=top]:rotate-45',
  'data-[side=bottom]:-translate-x-1/2 data-[side=bottom]:rotate-45',
  'data-[side=left]:-translate-y-1/2 data-[side=left]:rotate-45',
  'data-[side=right]:-translate-y-1/2 data-[side=right]:rotate-45',
].join(' ')

export const popoverHeaderClassName = 'mb-2 grid gap-1'

export const popoverTitleClassName = 'text-sm font-medium leading-none text-popover-foreground'

export const popoverDescriptionClassName = 'text-sm leading-6 text-muted-foreground'

export type PopoverStyleProps = VariantProps<typeof popoverContentClassName>
