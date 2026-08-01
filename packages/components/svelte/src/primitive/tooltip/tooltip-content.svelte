<script lang="ts">
  import { tooltipContentClassName } from '@fex/components-styles/tooltip'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { tooltipContextKey, type TooltipContext } from './tooltip-context'
  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> { class?: string; children?: Snippet }
  let { class: className, children, style, ...rest }: Props = $props()
  const { contentId, overlay, snapshot } = getContext<TooltipContext>(tooltipContextKey)
  const classes = $derived(cn(tooltipContentClassName, className))
  function content(element: HTMLDivElement) { overlay.setFloatingElement(element); return { destroy: () => overlay.setFloatingElement(null) } }
</script>
{#if $snapshot.mounted}<div {...rest} use:content id={contentId} role="tooltip" data-slot="tooltip-content" data-state={$snapshot.open ? 'open' : 'closed'} data-phase={$snapshot.phase} data-side={$snapshot.side} data-align={$snapshot.align} data-placement={$snapshot.placement} class={classes} {style} style:position="var(--floating-strategy, absolute)" style:left="var(--floating-x, 0px)" style:top="var(--floating-y, 0px)" style:transform-origin="var(--floating-transform-origin)">{@render children?.()}</div>{/if}
