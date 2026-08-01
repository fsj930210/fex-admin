<script lang="ts">
  import { popoverContentClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { popoverContextKey, type PopoverContext } from './popover-context'

  interface PopoverContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, role = 'dialog', style, ...rest }: PopoverContentProps = $props()
  const { contentElement, hoverAncestors, overlay, snapshot } = getContext<PopoverContext>(popoverContextKey)
  const classList = $derived(cn(popoverContentClassName(), className))

  function contentAction(element: HTMLDivElement) {
    contentElement.current = element
    overlay.setFloatingElement(element)
    return {
      destroy() {
        if (contentElement.current === element) {
          contentElement.current = null
        }
        overlay.setFloatingElement(null)
      },
    }
  }

  function handlePointerEnter(event: PointerEvent) {
    const info = {
      target: event.target,
      currentTarget: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
      event,
    }
    hoverAncestors.forEach((ancestor) => ancestor.content.pointerEnter(info))
    overlay.content.pointerEnter(info)
  }

  function handlePointerLeave(event: PointerEvent) {
    const info = {
      target: event.target,
      currentTarget: event.currentTarget,
      clientX: event.clientX,
      clientY: event.clientY,
      pointerType: event.pointerType,
      event,
    }
    hoverAncestors.forEach((ancestor) => ancestor.content.pointerLeave(info))
    overlay.content.pointerLeave(info)
  }
</script>

{#if $snapshot.mounted}
  <div
    {...rest}
    use:contentAction
    {role}
    tabindex="-1"
    data-slot="popover-content"
    data-state={$snapshot.open ? 'open' : 'closed'}
    data-phase={$snapshot.phase}
    data-side={$snapshot.side}
    data-align={$snapshot.align}
    data-placement={$snapshot.placement}
    class={classList}
    onpointerenter={handlePointerEnter}
    onpointerleave={handlePointerLeave}
    {style}
    style:position="var(--floating-strategy, absolute)"
    style:left="var(--floating-x, 0px)"
    style:top="var(--floating-y, 0px)"
    style:transform-origin="var(--floating-transform-origin)"
  >
    {@render children?.()}
  </div>
{/if}
