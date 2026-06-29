<script lang="ts">
  import { tableRowClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLTableRowElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableRowClassName, className))
</script>
<tr {...rest} data-slot="table-row" class={classList}>{@render children?.()}</tr>
