<script lang="ts">
  import { toastTitleClassName } from '@fex/components-styles/toast'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    children?: Snippet
    class?: string
  }

  let { children, class: className, ...rest }: Props = $props()
</script>

<div {...rest} data-slot="toast-title" class={cn(toastTitleClassName, className)}>
  {@render children?.()}
</div>
