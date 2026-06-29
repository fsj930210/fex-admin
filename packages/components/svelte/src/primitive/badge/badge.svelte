<script lang="ts">
  import { badgeClassName, type BadgeStyleProps } from '@fex/components-styles/badge'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'>, BadgeStyleProps { class?: string; children?: Snippet }
  let { class: className, children, variant = 'default', ...rest }: Props = $props()
  const classList = $derived(cn(badgeClassName({ variant }), className))
</script>
<span {...rest} data-slot="badge" data-variant={variant} class={classList}>{@render children?.()}</span>
