import { cva, type VariantProps } from 'class-variance-authority'

export const tagPresetColors = ['neutral', 'primary', 'success', 'warning', 'danger'] as const
export type TagPresetColor = (typeof tagPresetColors)[number]
export type TagColor = TagPresetColor | (string & {})

export function isTagPresetColor(color: TagColor): color is TagPresetColor {
  return (tagPresetColors as readonly string[]).includes(color)
}

export const tagClassName = cva(
  [
    'inline-flex max-w-full min-w-0 shrink-0 items-center justify-center gap-1 overflow-hidden rounded-[4px] border text-xs font-normal whitespace-nowrap',
    'transition-[color,background-color,border-color,opacity] data-[disabled=true]:opacity-50',
    '[&>svg]:pointer-events-none [&>svg]:shrink-0',
    'data-[color=neutral]:[--tag-color:var(--tag-color-neutral)]',
    'data-[color=primary]:[--tag-color:var(--tag-color-primary)]',
    'data-[color=success]:[--tag-color:var(--tag-color-success)]',
    'data-[color=warning]:[--tag-color:var(--tag-color-warning)]',
    'data-[color=danger]:[--tag-color:var(--tag-color-danger)]',
  ].join(' '),
  {
    variants: {
      variant: {
        subtle: 'border-transparent bg-[color-mix(in_oklch,var(--tag-color)_12%,transparent)] text-[var(--tag-color)]',
        outlined: 'border-[color-mix(in_oklch,var(--tag-color)_45%,transparent)] bg-transparent text-[var(--tag-color)]',
        solid: 'border-[var(--tag-color)] bg-[var(--tag-color)] text-[var(--tag-solid-foreground)]',
      },
      size: {
        sm: 'h-5 px-1.5 leading-[18px] [&>svg]:size-2.5',
        md: 'h-[22px] px-[7px] leading-5 [&>svg]:size-3',
      },
    },
    defaultVariants: { variant: 'subtle', size: 'md' },
  },
)

export const tagCloseClassName = [
  '-me-0.5 ms-0.5 inline-flex size-3 shrink-0 items-center justify-center text-current opacity-55 outline-none',
  'hover:opacity-100 focus-visible:rounded-[2px] focus-visible:ring-1 focus-visible:ring-current',
  'disabled:pointer-events-none disabled:opacity-30 [&>svg]:size-2.5',
].join(' ')

export type TagStyleProps = VariantProps<typeof tagClassName>
