<script lang="ts">
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { tourContextKey, type TourContext } from './tour-context'
  let { children, container }: { children?: Snippet; container?: HTMLElement | null } = $props()
  const { controller, snapshot, getPopupContainer } = getContext<TourContext>(tourContextKey)
  function portal(element: HTMLDivElement) { const target = snapshotValue()?.target ? controller.getTarget(snapshotValue()!.target!) : null; (container ?? getPopupContainer?.(target) ?? document.body).appendChild(element); return { destroy: () => element.remove() } }
  function snapshotValue() { return controller.getSnapshot().currentStep }
</script>
<div use:portal data-slot="tour-portal" style="display: contents">{@render children?.()}</div>
