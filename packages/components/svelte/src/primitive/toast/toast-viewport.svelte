<script module lang="ts">
  import type { ToastPlacement as Placement } from '@fex/components-styles/toast'

  const toastPlacements: Placement[] = ['top-left', 'top', 'top-right', 'bottom-left', 'bottom', 'bottom-right']
</script>

<script lang="ts">
  import {
    toastStackContainerClassName,
    toastStackItemsClassName,
    toastStackLayerClassName,
    toastViewportClassName,
    type ToastPlacement,
  } from '@fex/components-styles/toast'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { createToastStore } from '../../stores/toast'
  import { toast, type SvelteToastItem, type SvelteToastManager } from './toast'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
    children?: Snippet<[SvelteToastItem[]]>
    class?: string
    manager?: SvelteToastManager
    offset?: number | string
    placement?: ToastPlacement
    stack?: boolean
    stackThreshold?: number
  }

  let {
    children,
    class: className,
    manager = toast,
    offset = 24,
    placement,
    stack = false,
    stackThreshold = 3,
    style,
    ...rest
  }: Props = $props()

  // A mounted viewport owns one manager subscription; remount it to switch managers.
  // svelte-ignore state_referenced_locally
  const toastManager = manager
  const snapshot = createToastStore(toastManager)
  const offsetValue = $derived(typeof offset === 'number' ? `${offset}px` : offset)
  const styleValue = $derived(`--toast-offset:${offsetValue};${style ?? ''}`)
  const placements = $derived(placement ? [placement] : toastPlacements)

</script>

{#each placements as currentPlacement (currentPlacement)}
  {@const items = $snapshot.items.filter((item) => item.placement === currentPlacement)}
  {@const stacked = stack && items.length > stackThreshold}
  {@const renderedItems = stacked ? items.slice(-1) : items}
  {#if items.length > 0}
    <div {...rest} data-slot="toast-viewport" class={cn(toastViewportClassName({ placement: currentPlacement }), className)} style={styleValue}>
      <div class={toastStackContainerClassName({ placement: currentPlacement })}>
        {#if stacked}
          <div aria-hidden="true" class={cn(toastStackLayerClassName, 'top-2 opacity-70')}></div>
          <div aria-hidden="true" class={cn(toastStackLayerClassName, 'top-4 w-[calc(100%-32px)] opacity-40')}></div>
        {/if}
        <div class={toastStackItemsClassName({ placement: currentPlacement })}>
          {@render children?.(renderedItems)}
        </div>
      </div>
    </div>
  {/if}
{/each}
