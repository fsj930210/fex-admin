<script lang="ts">
  import { popoverDescriptionClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface PopoverDescriptionProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: PopoverDescriptionProps = $props()
</script>

<div {...rest} data-slot="popover-description" class={cn(popoverDescriptionClassName, className)}>
  {@render children?.()}
</div>
