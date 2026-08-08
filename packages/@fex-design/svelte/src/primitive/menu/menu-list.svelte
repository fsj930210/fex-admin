<script lang="ts">
  import {
    handleMenuListFocus,
    handleMenuListKeyDown,
    syncMenuListTabStops,
    type MenuOrientation,
  } from '@fex-design/core/menu/navigation'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
    orientation?: MenuOrientation
    parentValue?: string | number
  }

  let {
    children,
    orientation = 'vertical',
    parentValue,
    onfocus,
    onkeydown,
    ...rest
  }: Props = $props()
  let element: HTMLDivElement

  $effect(() => {
    orientation
    queueMicrotask(() => element && syncMenuListTabStops(element))
  })
</script>

<div
  {...rest}
  bind:this={element}
  role={rest.role ?? 'group'}
  aria-orientation={orientation}
  data-orientation={orientation}
  data-parent-value={parentValue}
  data-slot="menu-list"
  onfocus={(event) => {
    onfocus?.(event)
    if (!event.defaultPrevented) handleMenuListFocus(event)
  }}
  onkeydown={(event) => {
    onkeydown?.(event)
    if (!event.defaultPrevented) handleMenuListKeyDown(event, element, orientation)
  }}
>
  {@render children?.()}
</div>
