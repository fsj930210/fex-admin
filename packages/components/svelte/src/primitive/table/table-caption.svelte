<script lang="ts">
  import { tableCaptionClassName } from '@fex/components-styles/table'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> { class?: string | undefined; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(tableCaptionClassName, className))
</script>
<caption {...rest} data-slot="table-caption" class={classList}>{@render children?.()}</caption>
