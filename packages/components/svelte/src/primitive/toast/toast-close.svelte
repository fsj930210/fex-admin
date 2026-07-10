<script lang="ts">
  import { toastCloseClassName } from '@fex/components-styles/toast'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { toast as defaultToast, type SvelteToastItem, type SvelteToastManager } from './toast'

  interface Props extends Omit<HTMLButtonAttributes, 'class'> {
    children?: Snippet
    class?: string
    manager?: SvelteToastManager
    toast: SvelteToastItem
  }

  let { children, class: className, manager = defaultToast, toast, ...rest }: Props = $props()
</script>

<button
  {...rest}
  type="button"
  aria-label="Close toast"
  data-slot="toast-close"
  class={cn(toastCloseClassName, className)}
  onclick={() => manager.dismiss(toast.id)}
>
  {@render children?.()}
</button>
