<script lang="ts">
  import { kbdGroupClassName } from '@fex/components-styles/kbd'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(kbdGroupClassName, className))
</script>
<div {...rest} data-slot="kbd-group" class={classList}>{@render children?.()}</div>
