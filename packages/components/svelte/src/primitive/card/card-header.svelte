<script lang="ts">
  import { cardHeaderClassName } from '@fex/components-styles/card'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CardHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: CardHeaderProps = $props()

  const classList = $derived(cn(cardHeaderClassName(), className))
</script>

<div {...rest} data-slot="card-header" class={classList}>
  {@render children?.()}
</div>
