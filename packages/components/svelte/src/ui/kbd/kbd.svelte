<script lang="ts">
  import { kbdClassName } from '@fex/components-styles/kbd'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(kbdClassName, className))
</script>
<kbd {...rest} data-slot="kbd" class={classList}>{@render children?.()}</kbd>
