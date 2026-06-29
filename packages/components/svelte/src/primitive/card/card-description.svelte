<script lang="ts">
  import { cardDescriptionClassName } from '@fex/components-styles/card'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CardDescriptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: CardDescriptionProps = $props()

  const classList = $derived(cn(cardDescriptionClassName, className))
</script>

<div {...rest} data-slot="card-description" class={classList}>
  {@render children?.()}
</div>
