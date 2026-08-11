import { isTagPresetColor, tagClassName, tagCloseClassName, type TagColor, type TagStyleProps } from '@fex-design/styles/tag'
import { cn } from '@fex/utils'
import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { CloseIcon } from '../../icon/close'

type TagStyle = JSX.CSSProperties & { '--tag-color'?: string }
export interface TagProps extends ParentProps<Omit<JSX.HTMLAttributes<HTMLSpanElement>, 'color'>>, TagStyleProps { color?: TagColor; closable?: boolean; closeIcon?: JSX.Element; closeLabel?: string; disabled?: boolean; onClose?: JSX.EventHandler<HTMLButtonElement, MouseEvent> }

export function Tag(props: TagProps) {
  const [local, rest] = splitProps(props, ['class', 'style', 'children', 'color', 'variant', 'size', 'closable', 'closeIcon', 'closeLabel', 'disabled', 'onClose'])
  const color = () => local.color ?? 'neutral'
  const preset = () => isTagPresetColor(color())
  const style = (): TagStyle => ({ ...(preset() ? undefined : { '--tag-color': color() }), ...(typeof local.style === 'object' ? local.style : {}) })
  return <span {...rest} data-slot="tag" data-color={preset() ? color() : 'custom'} data-variant={local.variant ?? 'subtle'} data-size={local.size ?? 'md'} data-disabled={local.disabled ? 'true' : undefined} class={cn(tagClassName({ variant: local.variant, size: local.size }), local.class)} style={style()}>
    {local.children}
    {local.closable ? <button type="button" data-slot="tag-close" aria-label={local.closeLabel ?? 'Close'} disabled={local.disabled} class={tagCloseClassName} onClick={local.onClose}>{local.closeIcon ?? <CloseIcon aria-hidden />}</button> : null}
  </span>
}
