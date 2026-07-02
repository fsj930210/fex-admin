<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { popoverContextKey, type PopoverContext } from './popover-context'

  interface PopoverPortalProps {
    children?: Snippet
    container?: HTMLElement | null
    forceMount?: boolean
  }

  let { children, container, forceMount }: PopoverPortalProps = $props()
  const { overlay, snapshot } = getContext<PopoverContext>(popoverContextKey)
  let portalElement = $state<HTMLDivElement>()

  $effect(() => {
    if (!portalElement || (!$snapshot.mounted && !forceMount)) return
    const target = container ?? overlay.resolvePopupContainer() ?? document.body
    target.appendChild(portalElement)
    return () => {
      portalElement?.remove()
    }
  })
</script>

{#if $snapshot.mounted || forceMount}
  <div bind:this={portalElement} data-slot="popover-portal" style="display: contents">
    {@render children?.()}
  </div>
{/if}
