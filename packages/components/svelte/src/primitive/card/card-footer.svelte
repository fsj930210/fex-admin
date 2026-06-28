<script lang="ts">
  import { cardFooterClassName } from '@fex/components-styles/card'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CardFooterProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: CardFooterProps = $props()

  const classList = $derived(cn(cardFooterClassName(), className))
</script>

<div {...rest} data-slot="card-footer" class={classList}>
  {@render children?.()}
</div>
