<script lang="ts">
  import { tourArrowClassName } from '@fex-design/styles/tour'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import { tourContentContextKey, type TourContentContext } from './tour-context'
  let { class: className, style }: { class?: string; style?: string } = $props()
  const { floating, snapshot } = getContext<TourContentContext>(tourContentContextKey)
  const sideStyle = $derived($snapshot.side === 'top' ? 'bottom: -6px; left: var(--floating-arrow-x, 50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-top: 6px solid var(--background);' : $snapshot.side === 'bottom' ? 'top: -6px; left: var(--floating-arrow-x, 50%); border-left: 6px solid transparent; border-right: 6px solid transparent; border-bottom: 6px solid var(--background);' : $snapshot.side === 'left' ? 'right: -6px; top: var(--floating-arrow-y, 50%); border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-left: 6px solid var(--background);' : 'left: -6px; top: var(--floating-arrow-y, 50%); border-top: 6px solid transparent; border-bottom: 6px solid transparent; border-right: 6px solid var(--background);')
  function arrowAction(element: HTMLDivElement) { floating.setArrowElement(element); return { destroy: () => floating.setArrowElement(null) } }
</script>
<div use:arrowAction data-slot="tour-arrow" data-side={$snapshot.side} class={cn(tourArrowClassName, className)} style={`${sideStyle}; ${style ?? ''}`} />
