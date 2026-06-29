<script lang="ts">
  import { alertActionClassName } from '@fex/components-styles/alert'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(alertActionClassName, className))
</script>
<div {...rest} data-slot="alert-action" class={classList}>{@render children?.()}</div>
