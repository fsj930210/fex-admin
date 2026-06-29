<script lang="ts">
  import { tableHeaderClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLTableSectionElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableHeaderClassName, className))
</script>
<thead {...rest} data-slot="table-header" class={classList}>{@render children?.()}</thead>
