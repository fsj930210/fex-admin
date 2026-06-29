<script lang="ts">
  import { alertDescriptionClassName } from '@fex/components-styles/alert'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(alertDescriptionClassName, className))
</script>
<div {...rest} data-slot="alert-description" class={classList}>{@render children?.()}</div>
