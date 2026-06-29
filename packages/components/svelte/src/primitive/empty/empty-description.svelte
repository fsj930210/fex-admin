<script lang="ts">
  import { emptyDescriptionClassName } from '@fex/components-styles/empty'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  interface Props extends Omit<HTMLAttributes<HTMLParagraphElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, ...rest }: Props = $props()
  const classList = $derived(cn(emptyDescriptionClassName, className))
</script>
<p {...rest} data-slot="empty-description" class={classList}>{@render children?.()}</p>
