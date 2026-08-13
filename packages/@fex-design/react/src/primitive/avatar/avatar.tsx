import {
  avatarBadgeClassName,
  avatarClassName,
  avatarFallbackClassName,
  avatarImageClassName,
  type AvatarStyleProps,
} from '@fex-design/styles/avatar'
import { cn } from '@fex/utils'
import { createContext, use, useState, type ComponentProps } from 'react'

type AvatarContextValue = { loaded: boolean; setLoaded: (loaded: boolean) => void }
const AvatarContext = createContext<AvatarContextValue | null>(null)

export function Avatar({
  size = 'md',
  shape = 'circle',
  className,
  ...props
}: ComponentProps<'span'> & AvatarStyleProps) {
  const [loaded, setLoaded] = useState(false)
  return (
    <AvatarContext value={{ loaded, setLoaded }}>
      <span
        data-slot="avatar"
        data-size={size}
        data-shape={shape}
        className={cn(avatarClassName({ size, shape }), className)}
        {...props}
      />
    </AvatarContext>
  )
}

export function AvatarImage({ className, onLoad, onError, ...props }: ComponentProps<'img'>) {
  const context = use(AvatarContext)
  return (
    <img
      data-slot="avatar-image"
      className={cn(avatarImageClassName, className)}
      hidden={!context?.loaded}
      onLoad={(event) => {
        context?.setLoaded(true)
        onLoad?.(event)
      }}
      onError={(event) => {
        context?.setLoaded(false)
        onError?.(event)
      }}
      {...props}
    />
  )
}

export function AvatarFallback({ className, ...props }: ComponentProps<'span'>) {
  const context = use(AvatarContext)
  return context?.loaded ? null : (
    <span
      data-slot="avatar-fallback"
      className={cn(avatarFallbackClassName, className)}
      {...props}
    />
  )
}

export function AvatarBadge({ className, ...props }: ComponentProps<'span'>) {
  return (
    <span data-slot="avatar-badge" className={cn(avatarBadgeClassName, className)} {...props} />
  )
}
