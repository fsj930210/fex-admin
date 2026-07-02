<script lang="ts">
  import { popoverTitleClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface PopoverTitleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: PopoverTitleProps = $props()
</script>

<div {...rest} data-slot="popover-title" class={cn(popoverTitleClassName, className)}>
  {@render children?.()}
</div>
