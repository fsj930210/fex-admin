import { cva, type VariantProps } from 'class-variance-authority'

export const listboxRootClassName = cva(
  [
    'flex min-w-0 gap-2 outline-none',
    'data-[orientation=vertical]:flex-col data-[orientation=horizontal]:flex-row data-[orientation=horizontal]:flex-wrap',
  ].join(' '),
  {
    variants: {
      variant: {
        default: '',
        grid: 'grid data-[orientation=horizontal]:grid-cols-[repeat(auto-fit,minmax(180px,1fr))]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

export const listboxGroupClassName = [
  'flex min-w-0 flex-col gap-2',
  'data-[orientation=horizontal]:contents',
].join(' ')

export const listboxGroupLabelClassName =
  'px-2 text-sm font-medium leading-5 text-muted-foreground'

export const listboxItemClassName = cva(
  [
    'group/listbox-item relative flex min-w-0 cursor-pointer select-none items-start gap-3 rounded-md border border-border bg-background p-3 text-left outline-none transition-colors',
    'hover:bg-muted-background focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
    'data-[selected=true]:border-primary/40 data-[selected=true]:bg-primary/5',
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
  ].join(' '),
  {
    variants: {
      size: {
        default: 'min-h-16',
        sm: 'min-h-12 p-2',
        lg: 'min-h-20 p-4',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

export const listboxItemContentClassName = 'min-w-0 flex-1 space-y-1'

export const listboxItemTitleClassName = 'block truncate text-sm font-medium leading-5 text-foreground'

export const listboxItemDescriptionClassName = 'block text-xs leading-5 text-muted-foreground'

export const listboxItemIndicatorClassName =
  'mt-0.5 inline-flex size-4 shrink-0 items-center justify-center text-primary opacity-0 transition-opacity group-data-[selected=true]/listbox-item:opacity-100 [&_svg]:size-4'

export type ListboxRootStyleProps = VariantProps<typeof listboxRootClassName>

export type ListboxItemStyleProps = VariantProps<typeof listboxItemClassName>
