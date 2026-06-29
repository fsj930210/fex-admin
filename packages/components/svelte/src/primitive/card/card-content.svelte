<script lang="ts">
  import { cardContentClassName } from '@fex/components-styles/card'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CardContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: CardContentProps = $props()

  const classList = $derived(cn(cardContentClassName, className))
</script>

<div {...rest} data-slot="card-content" class={classList}>
  {@render children?.()}
</div>
