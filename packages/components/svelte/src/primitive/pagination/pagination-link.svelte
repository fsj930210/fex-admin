<script lang="ts">
  import { paginationLinkClassName, paginationTextLinkClassName } from '@fex/components-styles/pagination'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAnchorAttributes, 'class'> { class?: string | undefined; children?: Snippet; isActive?: boolean; size?: 'default' | 'icon' }
  let { class: className, children, isActive = false, size = 'icon', ...rest }: Props = $props()
  const classList = $derived(cn(paginationLinkClassName, size === 'default' ? paginationTextLinkClassName : '', className))
</script>
<a {...rest} aria-current={isActive ? 'page' : undefined} data-slot="pagination-link" data-active={isActive ? 'true' : undefined} class={classList}>{@render children?.()}</a>
