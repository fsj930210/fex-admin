<script lang="ts">
  import { paginationClassName } from '@fex/components-styles/pagination'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(paginationClassName, className))
</script>
<nav {...rest} role="navigation" aria-label="pagination" data-slot="pagination" class={classList}>{@render children?.()}</nav>
