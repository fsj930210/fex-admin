<script lang="ts">
  import { paginationEllipsisClassName, paginationSrOnlyClassName } from '@fex/components-styles/pagination'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import EllipsisIcon from '../../icon/more.svelte'
  interface Props extends Omit<HTMLAttributes<HTMLSpanElement>, 'class'> { class?: string | undefined }
  let { class: className, ...rest }: Props = $props()
  const classList = $derived(cn(paginationEllipsisClassName, className))
</script>
<span {...rest} aria-hidden="true" data-slot="pagination-ellipsis" class={classList}><EllipsisIcon /><span class={paginationSrOnlyClassName}>More pages</span></span>
