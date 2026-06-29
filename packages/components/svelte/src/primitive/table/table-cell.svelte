<script lang="ts">
  import { tableCellClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLTdAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLTdAttributes, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableCellClassName, className))
</script>
<td {...rest} data-slot="table-cell" class={classList}>{@render children?.()}</td>
