<script lang="ts">
  import { cardClassName } from '@fex/components-styles/card'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: CardProps = $props()

  const classList = $derived(cn(cardClassName, className))
</script>

<div {...rest} data-slot="card" class={classList}>
  {@render children?.()}
</div>
