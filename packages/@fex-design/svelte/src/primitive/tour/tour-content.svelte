<script lang="ts">
  import { createFloating } from '@fex-design/core/floating/create-floating'
  import { tourContentClassName } from '@fex-design/styles/tour'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import { getContext, onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { tourContentContextKey, tourContextKey, type TourContext, type TourContentContext } from './tour-context'
  let { children, class: className, style }: { children?: Snippet; class?: string; style?: string } = $props()
  const { controller, snapshot, defaultGap, zIndex } = getContext<TourContext>(tourContextKey)
  const floating = createFloating({ placement: 'bottom', arrow: true, offset: 12 })
  const floatingSnapshot = readableCoreStore(floating)
  const step = $derived($snapshot.currentStep)
  const target = $derived(step?.target ? controller.getTarget(step.target) : null)
  const gap = $derived(step?.gap?.offset ?? defaultGap)
  $effect(() => { const offset = (Array.isArray(gap) ? Math.max(gap[0], gap[1]) : gap) + 12; floating.setOptions({ placement: step?.placement ?? 'bottom', arrow: step?.arrow !== false, offset }); floating.setReferenceElement(target); if ($snapshot.open && target) floating.startAutoUpdate(); else floating.stopAutoUpdate() })
  function contentAction(element: HTMLDivElement) { floating.setFloatingElement(element); return { destroy: () => floating.setFloatingElement(null) } }
  setContext<TourContentContext>(tourContentContextKey, { floating, snapshot: floatingSnapshot })
  onDestroy(() => floating.destroy())
</script>
{#if $snapshot.open && step}<div use:contentAction role="dialog" tabindex="-1" data-slot="tour-content" data-side={$floatingSnapshot.side} data-placement={$floatingSnapshot.placement} class={cn(tourContentClassName, className)} style={`position: var(--floating-strategy, absolute); left: var(--floating-x, 0px); top: var(--floating-y, 0px); transform-origin: var(--floating-transform-origin); z-index: ${zIndex}; ${style ?? ''}`}>{@render children?.()}</div>{/if}
