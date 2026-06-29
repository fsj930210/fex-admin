<script lang="ts">
  import { cardTitleClassName } from '@fex/components-styles/card'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CardTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: CardTitleProps = $props()

  const classList = $derived(cn(cardTitleClassName, className))
</script>

<div {...rest} data-slot="card-title" class={classList}>
  {@render children?.()}
</div>
