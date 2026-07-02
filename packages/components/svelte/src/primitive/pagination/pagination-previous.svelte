<script lang="ts">
  import { paginationLinkClassName, paginationTextClassName, paginationTextLinkClassName } from '@fex/components-styles/pagination'
  import { cn } from '@fex/utils'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import ChevronLeftIcon from '../../icon/chevron-left.svelte'
  interface Props extends Omit<HTMLAnchorAttributes, 'class'> { class?: string | undefined; text?: string }
  let { class: className, text = 'Previous', ...rest }: Props = $props()
  const classList = $derived(cn(paginationLinkClassName, paginationTextLinkClassName, className))
</script>
<a {...rest} aria-label="Go to previous page" data-slot="pagination-link" class={classList}><ChevronLeftIcon /><span class={paginationTextClassName}>{text}</span></a>
