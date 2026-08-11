import { isTagPresetColor, tagClassName, tagCloseClassName, type TagColor, type TagStyleProps } from '@fex-design/styles/tag'
import { cn } from '@fex/utils'
import type { ComponentProps, CSSProperties, MouseEvent, ReactNode } from 'react'
import { CloseIcon } from '../../icon/close'

type TagCSSProperties = CSSProperties & { '--tag-color'?: string }

export interface TagProps extends Omit<ComponentProps<'span'>, 'color' | 'onClose'>, TagStyleProps {
  color?: TagColor
  closable?: boolean
  closeIcon?: ReactNode
  closeLabel?: string
  disabled?: boolean
  onClose?: (event: MouseEvent<HTMLButtonElement>) => void
}

export function Tag({ color = 'neutral', variant = 'subtle', size = 'md', closable = false, closeIcon, closeLabel = 'Close', disabled = false, onClose, children, className, style, ...props }: TagProps) {
  const preset = isTagPresetColor(color)
  const mergedStyle: TagCSSProperties = { ...(preset ? undefined : { '--tag-color': color }), ...style }
  return <span {...props} data-slot="tag" data-color={preset ? color : 'custom'} data-variant={variant} data-size={size} data-disabled={disabled ? 'true' : undefined} className={cn(tagClassName({ variant, size }), className)} style={mergedStyle}>
    {children}
    {closable ? <button type="button" data-slot="tag-close" aria-label={closeLabel} disabled={disabled} className={tagCloseClassName} onClick={onClose}>{closeIcon ?? <CloseIcon aria-hidden />}</button> : null}
  </span>
}
