<script lang="ts">
  import { paginationTextClassName } from '@fex/components-styles/pagination'
  import type { HTMLAnchorAttributes } from 'svelte/elements'
  import ChevronLeftIcon from '../../icon/chevron-left.svelte'
  import PaginationLink from './pagination-link.svelte'
  interface Props extends HTMLAnchorAttributes { text?: string }
  let { text = 'Previous', ...rest }: Props = $props()
</script>
<PaginationLink {...rest} aria-label="Go to previous page" size="default"><ChevronLeftIcon /><span class={paginationTextClassName}>{text}</span></PaginationLink>
