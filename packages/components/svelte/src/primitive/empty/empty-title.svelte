<script lang="ts">
  import { emptyTitleClassName } from '@fex/components-styles/empty'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(emptyTitleClassName, className))
</script>
<div {...rest} data-slot="empty-title" class={classList}>{@render children?.()}</div>
