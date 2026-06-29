<script lang="ts">
  import { tableClassName, tableContainerClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLTableAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLTableAttributes, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableClassName, className))
</script>
<div data-slot="table-container" class={tableContainerClassName}><table {...rest} data-slot="table" class={classList}>{@render children?.()}</table></div>
