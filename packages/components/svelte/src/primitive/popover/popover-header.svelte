<script lang="ts">
  import { popoverHeaderClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface PopoverHeaderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, ...rest }: PopoverHeaderProps = $props()
</script>

<div {...rest} data-slot="popover-header" class={cn(popoverHeaderClassName, className)}>
  {@render children?.()}
</div>
