<script lang="ts">
  import { isTagPresetColor, tagClassName, tagCloseClassName, type TagColor, type TagStyleProps } from '@fex-design/styles/tag'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import CloseIcon from '../../icon/close.svelte'

  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, TagStyleProps {
    color?: TagColor; closable?: boolean; closeIcon?: Snippet; closeLabel?: string; disabled?: boolean
    onClose?: (event: MouseEvent) => void; children?: Snippet
  }
  let { class: className, style, color = 'neutral', variant = 'subtle', size = 'md', closable = false, closeIcon, closeLabel = 'Close', disabled = false, onClose, children, ...rest }: Props = $props()
  const preset = $derived(isTagPresetColor(color))
  const rootStyle = $derived(`${preset ? '' : `--tag-color:${color};`}${typeof style === 'string' ? style : ''}`)
</script>

<span {...rest} data-slot="tag" data-color={preset ? color : 'custom'} data-variant={variant} data-size={size} data-disabled={disabled ? 'true' : undefined} class={cn(tagClassName({ variant, size }), className)} style={rootStyle}>
  {@render children?.()}
  {#if closable}<button type="button" data-slot="tag-close" aria-label={closeLabel} {disabled} class={tagCloseClassName} onclick={onClose}>{#if closeIcon}{@render closeIcon()}{:else}<CloseIcon aria-hidden="true" />{/if}</button>{/if}
</span>
