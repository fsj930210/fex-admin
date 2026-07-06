<script lang="ts">
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface SortableHandleProps extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, type = 'button', ...rest }: SortableHandleProps = $props()
</script>

<button
  {...rest}
  {type}
  data-sortable-handle
  class={cn('cursor-grab touch-none select-none active:cursor-grabbing', className)}
>
  {@render children?.()}
</button>
