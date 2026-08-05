<script lang="ts">
  import { popoverContentClassName, popoverMenuContentClassName } from '@fex-design/styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { contextMenuContextKey, type ContextMenuContext } from './context-menu-context'
  interface Props extends HTMLAttributes<HTMLDivElement> { children?: Snippet }
  let { children, class: className, style, role = 'menu', ...rest }: Props = $props()
  const { controller, snapshot } = getContext<ContextMenuContext>(contextMenuContextKey)
  function ref(element: HTMLDivElement) { queueMicrotask(() => controller.overlay.setFloatingElement(element)); return { destroy() { controller.overlay.setFloatingElement(null) } } }
</script>
{#if $snapshot.overlay.mounted}
  <div use:ref {...rest} {role} tabindex="-1" data-slot="context-menu-content" data-state={$snapshot.overlay.open ? 'open' : 'closed'} data-phase={$snapshot.overlay.phase} data-side={$snapshot.overlay.side} data-align={$snapshot.overlay.align} class={cn(popoverContentClassName(), popoverMenuContentClassName, className)} style={`position:var(--floating-strategy, absolute);left:var(--floating-x,0px);top:var(--floating-y,0px);${style ?? ''}`}>
    {@render children?.()}
  </div>
{/if}
