<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { tooltipContextKey, type TooltipContext } from './tooltip-context'
  type Props = Omit<HTMLAttributes<HTMLElement>, 'children'> & { children?: Snippet<[{ action: (element: HTMLElement) => { destroy: () => void }; props: HTMLAttributes<HTMLElement>; state: ReturnType<TooltipContext['overlay']['getSnapshot']> }]> }
  let { children, ...rest }: Props = $props()
  const { contentId, overlay, snapshot, triggerElement } = getContext<TooltipContext>(tooltipContextKey)
  const info = (event: Event) => ({ target: event.target, currentTarget: event.currentTarget, event })
  function action(element: HTMLElement) { triggerElement.current = element; overlay.setReferenceElement(element); return { destroy() { if (triggerElement.current === element) triggerElement.current = null; overlay.setReferenceElement(null) } } }
  const triggerProps = $derived({ ...rest, 'aria-describedby': $snapshot.mounted ? [rest['aria-describedby'], contentId].filter(Boolean).join(' ') : rest['aria-describedby'], 'data-state': $snapshot.open ? 'open' : 'closed',
    onpointerenter: (event: PointerEvent) => overlay.trigger.pointerEnter(info(event)), onpointerleave: (event: PointerEvent) => overlay.trigger.pointerLeave(info(event)),
    onfocus: (event: FocusEvent) => overlay.trigger.focus(info(event)), onblur: (event: FocusEvent) => overlay.trigger.blur(info(event)), } satisfies HTMLAttributes<HTMLElement>)
</script>
{@render children?.({ action, props: triggerProps, state: $snapshot })}
