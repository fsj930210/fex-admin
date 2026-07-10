<script lang="ts">
  import { toastRootClassName, type ToastStyleProps } from '@fex/components-styles/toast'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { toast as defaultToast, type SvelteToastItem, type SvelteToastManager } from './toast'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    children?: Snippet
    class?: string
    manager?: SvelteToastManager
    toast: SvelteToastItem
  }

  let { children, class: className, manager = defaultToast, toast, ...rest }: Props = $props()
  const variant = $derived(isKnownVariant(toast.variant) ? toast.variant : 'default')
  const classList = $derived(cn(toastRootClassName({ variant }), className))

  function isKnownVariant(variant: SvelteToastItem['variant']): variant is NonNullable<ToastStyleProps['variant']> {
    return variant === 'default' || variant === 'success' || variant === 'info' || variant === 'warning' || variant === 'error' || variant === 'loading'
  }
</script>

<div
  {...rest}
  data-paused={toast.paused ? '' : undefined}
  data-slot="toast"
  data-variant={toast.variant}
  role="status"
  class={classList}
  onpointerenter={() => manager.pause(toast.id)}
  onpointerleave={() => manager.resume(toast.id)}
>
  {@render children?.()}
</div>
