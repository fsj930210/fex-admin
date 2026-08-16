import { cva, type VariantProps } from 'class-variance-authority'

export const avatarClassName = cva(
  'group/avatar relative inline-flex shrink-0 items-center justify-center bg-muted-background text-muted-foreground select-none',
  {
    variants: {
      size: { sm: 'size-6 text-xs', md: 'size-8 text-sm', lg: 'size-10 text-sm' },
      shape: { circle: 'rounded-full', square: 'rounded-md' },
    },
    defaultVariants: { size: 'md', shape: 'circle' },
  },
)
export const avatarImageClassName = 'size-full rounded-[inherit] object-cover'
export const avatarImageHostClassName = 'contents rounded-[inherit]'
export const avatarFallbackClassName =
  'flex size-full items-center justify-center overflow-hidden rounded-[inherit] font-medium'
export const avatarBadgeClassName =
  'absolute end-0 bottom-0 z-10 inline-flex size-2.5 items-center justify-center rounded-full bg-success ring-2 ring-background group-data-[size=sm]/avatar:size-2 group-data-[size=lg]/avatar:size-3'
export const avatarGroupClassName =
  'inline-flex items-center [&>[data-slot=avatar]+[data-slot=avatar]]:-ms-2 [&>[data-slot=avatar]]:ring-2 [&>[data-slot=avatar]]:ring-background'
export const avatarGroupOverflowClassName =
  'relative inline-flex shrink-0 items-center justify-center rounded-full bg-muted-background text-sm font-medium text-muted-foreground ring-2 ring-background'
export type AvatarStyleProps = VariantProps<typeof avatarClassName>
