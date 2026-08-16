<script lang="ts">
  import { buttonGroupClassName, type ButtonGroupStyleProps } from '@fex-design/styles/button'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'style'>, ButtonGroupStyleProps { class?: string; style?: string; spacing?: number | string; children?: Snippet }
  let { class: className, style, spacing = 0, orientation = 'horizontal', children, ...rest }: Props = $props()
  const gap = $derived(typeof spacing === 'number' ? `${spacing}px` : spacing)
</script>
<div {...rest} role="group" data-slot="button-group" data-orientation={orientation} class={cn(buttonGroupClassName({ orientation, connected: spacing === 0 }), className)} style={`gap:${gap};${style ?? ''}`}>{@render children?.()}</div>
