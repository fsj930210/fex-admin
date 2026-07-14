import { cva, type VariantProps } from 'class-variance-authority'
import { selectableItemSelectedClassName } from '@fex/components-styles/selectable-item'

export const menuRootClassName = cva('min-w-0 text-sm text-foreground', {
  variants: {
    size: {
      sm: '[--menu-item-height:28px] [--menu-item-padding-x:8px] [--menu-indent:14px]',
      md: '[--menu-item-height:32px] [--menu-item-padding-x:10px] [--menu-indent:18px]',
      lg: '[--menu-item-height:36px] [--menu-item-padding-x:12px] [--menu-indent:22px]',
    },
  },
  defaultVariants: {
    size: 'md',
  },
})

export const menuListClassName = cva('flex min-w-0 gap-0.5 outline-none', {
  variants: {
    orientation: {
      vertical: 'flex-col',
      horizontal: 'flex-row flex-wrap items-center',
    },
  },
  defaultVariants: {
    orientation: 'vertical',
  },
})

export const menuItemClassName = cva(
  [
    'group/menu-item flex h-[var(--menu-item-height)] min-w-0 cursor-pointer select-none items-center gap-2 rounded-md border border-transparent bg-transparent px-[var(--menu-item-padding-x)] text-left outline-none transition-colors',
    'hover:bg-muted-background focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
    selectableItemSelectedClassName,
    'data-[disabled=true]:pointer-events-none data-[disabled=true]:cursor-not-allowed data-[disabled=true]:opacity-50',
  ].join(' '),
  {
    variants: {
      orientation: {
        vertical: 'w-full',
        horizontal: 'w-auto',
      },
    },
    defaultVariants: {
      orientation: 'vertical',
    },
  },
)

export const menuItemIconClassName =
  'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-colors group-data-[selected=true]/menu-item:text-primary [&_svg]:size-4'

export const menuItemLabelClassName = 'min-w-0 flex-1 truncate'

export const menuItemSuffixClassName =
  'ml-auto inline-flex shrink-0 items-center justify-center text-xs text-muted-foreground'

export const menuExpandIconClassName =
  'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground transition-transform duration-150 group-data-[expanded=true]/menu-item:rotate-90 [&_svg]:size-4'

export const menuSubMenuContentClassName =
  'grid overflow-hidden transition-[grid-template-rows,opacity] duration-150 ease-out data-[expanded=false]:grid-rows-[0fr] data-[expanded=false]:opacity-0 data-[expanded=true]:grid-rows-[1fr] data-[expanded=true]:opacity-100'

export const menuSubMenuInnerClassName =
  'min-h-0 overflow-hidden transition-transform duration-150 ease-out in-data-[expanded=false]:-translate-y-1 in-data-[expanded=true]:translate-y-0'

export const menuGroupClassName = 'min-w-0 py-1'

export const menuGroupLabelClassName =
  'px-[var(--menu-item-padding-x)] py-1 text-xs font-medium leading-5 text-muted-foreground'

export const menuDividerClassName = 'my-1 h-px bg-border'

export type MenuRootStyleProps = VariantProps<typeof menuRootClassName>

export type MenuItemStyleProps = VariantProps<typeof menuItemClassName>

export type MenuListStyleProps = VariantProps<typeof menuListClassName>
