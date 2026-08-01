<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { tooltipContextKey, type TooltipContext } from './tooltip-context'
  let { children, container, forceMount }: { children?: Snippet; container?: HTMLElement | null; forceMount?: boolean } = $props()
  const { overlay, snapshot } = getContext<TooltipContext>(tooltipContextKey)
  function portal(element: HTMLDivElement) { ;(container ?? overlay.resolvePopupContainer() ?? document.body).appendChild(element); return { destroy: () => element.remove() } }
</script>
{#if $snapshot.mounted || forceMount}<div use:portal data-slot="tooltip-portal" style="display: contents">{@render children?.()}</div>{/if}
