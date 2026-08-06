<script lang="ts">
  import { tourOverlayClassName } from '@fex-design/styles/tour'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { tourContextKey, type TourContext } from './tour-context'
  let { children, class: className, style }: { children?: Snippet<[{ props: Record<string, unknown>; targetRect: DOMRect | null; gap: number | [number, number]; color: string }]>; class?: string; style?: string } = $props()
  const { snapshot, overlay, closeOnOverlayClick, controller, defaultGap, zIndex } = getContext<TourContext>(tourContextKey)
  const step = $derived($snapshot.currentStep)
  const gap = $derived(step?.gap?.offset ?? defaultGap)
  const color = $derived(typeof step?.mask === 'object' && step.mask.color ? step.mask.color : 'rgba(15, 23, 42, 0.58)')
  const rect = $derived($snapshot.targetRect ? { x: $snapshot.targetRect.x - (Array.isArray(gap) ? gap[0] : gap), y: $snapshot.targetRect.y - (Array.isArray(gap) ? gap[1] : gap), width: $snapshot.targetRect.width + (Array.isArray(gap) ? gap[0] * 2 : gap * 2), height: $snapshot.targetRect.height + (Array.isArray(gap) ? gap[1] * 2 : gap * 2) } : null)
  function click(event: MouseEvent) { if (closeOnOverlayClick && event.target === event.currentTarget) controller.close() }
  const overlayProps = $derived({ class: cn(tourOverlayClassName, className), style: `pointer-events: ${step?.disabledInteraction ? 'auto' : 'none'}; z-index: ${zIndex - 1}; ${style ?? ''}`, onclick: click })
</script>
{#if $snapshot.open && step?.mask !== false && overlay}{#if children}{@render children({ props: overlayProps, targetRect: $snapshot.targetRect, gap, color })}{:else}<div {...overlayProps}><svg aria-hidden="true" class="size-full" viewBox="0 0 100 100" preserveAspectRatio="none"><mask id="tour-mask"><rect width="100" height="100" fill="white" />{#if rect}<rect x={`${rect.x / innerWidth * 100}%`} y={`${rect.y / innerHeight * 100}%`} width={`${rect.width / innerWidth * 100}%`} height={`${rect.height / innerHeight * 100}%`} fill="black" />{/if}</mask><rect width="100" height="100" fill={color} mask="url(#tour-mask)" /></svg></div>{/if}{/if}
