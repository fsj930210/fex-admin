<script lang="ts">
  import { paginationContentClassName } from '@fex/components-styles/pagination'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLUListElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(paginationContentClassName, className))
</script>
<ul {...rest} data-slot="pagination-content" class={classList}>{@render children?.()}</ul>
