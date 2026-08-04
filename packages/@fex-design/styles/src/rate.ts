import { cva, type VariantProps } from 'class-variance-authority'

export const rateRootClassName = cva(
  [
    'inline-flex w-fit touch-none select-none items-center text-muted-foreground outline-none',
    'focus-visible:rounded-md focus-visible:ring-3 focus-visible:ring-focus/50',
    'data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
    'data-[readonly=false]:cursor-pointer',
  ].join(' '),
  {
    variants: {
      size: {
        sm: 'gap-0.5 [--rate-icon-size:16px]',
        default: 'gap-1 [--rate-icon-size:20px]',
        lg: 'gap-1.5 [--rate-icon-size:24px]',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const rateItemClassName = 'relative inline-flex size-[var(--rate-icon-size)] shrink-0'

export const rateContentClassName = [
  'absolute inset-0 inline-flex size-full items-center justify-center',
  '[&_svg]:size-full [&_svg]:shrink-0',
].join(' ')

export const rateEmptyContentClassName = `${rateContentClassName} text-muted-foreground [&_svg]:fill-transparent`

export const rateFilledContentClassName = `${rateContentClassName} pointer-events-none text-warning [&_svg]:fill-current`

export type RateStyleProps = VariantProps<typeof rateRootClassName>
