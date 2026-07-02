<script lang="ts">
  import { paginationLinkClassName, paginationTextClassName, paginationTextLinkClassName } from '@fex/components-styles/pagination'
  import { cn } from '@fex/utils'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  interface Props extends Omit<HTMLAnchorAttributes, 'class'> { class?: string | undefined; text?: string }
  let { class: className, text = 'Next', ...rest }: Props = $props()
  const classList = $derived(cn(paginationLinkClassName, paginationTextLinkClassName, className))
</script>
<a {...rest} aria-label="Go to next page" data-slot="pagination-link" class={classList}><span class={paginationTextClassName}>{text}</span><ChevronRightIcon /></a>
