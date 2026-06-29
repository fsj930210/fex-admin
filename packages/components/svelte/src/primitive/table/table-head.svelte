<script lang="ts">
  import { tableHeadClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLThAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLThAttributes, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableHeadClassName, className))
</script>
<th {...rest} data-slot="table-head" class={classList}>{@render children?.()}</th>
