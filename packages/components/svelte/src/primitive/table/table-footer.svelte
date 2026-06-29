<script lang="ts">
  import { tableFooterClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLTableSectionElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableFooterClassName, className))
</script>
<tfoot {...rest} data-slot="table-footer" class={classList}>{@render children?.()}</tfoot>
