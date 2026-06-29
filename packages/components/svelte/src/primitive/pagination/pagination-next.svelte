<script lang="ts">
  import { paginationTextClassName } from '@fex/components-styles/pagination'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  import PaginationLink from './pagination-link.svelte'
  interface Props extends HTMLAnchorAttributes { text?: string }
  let { text = 'Next', ...rest }: Props = $props()
</script>
<PaginationLink {...rest} aria-label="Go to next page" size="default"><span class={paginationTextClassName}>{text}</span><ChevronRightIcon /></PaginationLink>
