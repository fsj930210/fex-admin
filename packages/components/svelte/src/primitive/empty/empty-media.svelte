<script lang="ts">
  import { emptyMediaClassName, type EmptyMediaStyleProps } from '@fex/components-styles/empty'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'>, EmptyMediaStyleProps { class?: string; children?: Snippet }
  let { class: className, children, variant = 'default', ...rest }: Props = $props()
  const classList = $derived(cn(emptyMediaClassName({ variant }), className))
</script>
<div {...rest} data-slot="empty-icon" data-variant={variant} class={classList}>{@render children?.()}</div>
