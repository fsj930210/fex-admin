<script lang="ts">
  import { tooltipArrowClassName } from '@fex-design/styles/tooltip'
  import { getTooltipArrowPosition } from '@fex-design/core/tooltip/create-tooltip'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { tooltipContextKey, type TooltipContext } from './tooltip-context'
  let { class: className, style, ...rest }: Omit<HTMLAttributes<HTMLDivElement>, 'class'> & { class?: string } = $props()
  const { overlay, snapshot } = getContext<TooltipContext>(tooltipContextKey)
  const classes = $derived(cn(tooltipArrowClassName, className))
  const position = $derived(getTooltipArrowPosition($snapshot.side, $snapshot.align))
  function arrow(element: HTMLDivElement) { overlay.setArrowElement(element); return { destroy: () => overlay.setArrowElement(null) } }
</script>
<div {...rest} use:arrow data-slot="tooltip-arrow" data-side={$snapshot.side} data-align={$snapshot.align} class={classes} style={`${position.left ? `left: ${position.left}` : `top: ${position.top}`}; ${style ?? ''}`}></div>
