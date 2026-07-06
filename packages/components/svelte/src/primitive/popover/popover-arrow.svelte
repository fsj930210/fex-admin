<script lang="ts">
  import { popoverArrowClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { popoverContextKey, type PopoverContext } from './popover-context'

  interface PopoverArrowProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
  }

  let { class: className, style, ...rest }: PopoverArrowProps = $props()
  const { arrow, arrowElement, overlay, snapshot } = getContext<PopoverContext>(popoverContextKey)
  const classList = $derived(cn(popoverArrowClassName, className))
  const sideStyle = $derived(
    $snapshot.side === 'left' || $snapshot.side === 'right'
      ? 'top: clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-y,50%), calc(100% - var(--popover-arrow-inset,32px)))'
      : 'left: clamp(var(--popover-arrow-inset,32px), var(--floating-arrow-x,50%), calc(100% - var(--popover-arrow-inset,32px)))',
  )

  function arrowAction(element: HTMLDivElement) {
    arrowElement.current = element
    overlay.setArrowElement(element)
    return {
      destroy() {
        if (arrowElement.current === element) {
          arrowElement.current = null
        }
        overlay.setArrowElement(null)
      },
    }
  }
</script>

{#if arrow()}
  <div
    {...rest}
    use:arrowAction
    data-slot="popover-arrow"
    data-side={$snapshot.side}
    class={classList}
    style={sideStyle}
  ></div>
{/if}
