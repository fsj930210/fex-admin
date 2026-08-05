<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { contextMenuContextKey, type ContextMenuContext } from './context-menu-context'
  interface Props extends HTMLButtonAttributes { children?: Snippet }
  let { children, onclick, type = 'button', role = 'menuitem', ...rest }: Props = $props()
  const { controller } = getContext<ContextMenuContext>(contextMenuContextKey)
  function click(event: MouseEvent) {
    const handler = onclick
    if (typeof handler === 'function') {
      handler(event as MouseEvent & { currentTarget: EventTarget & HTMLButtonElement })
    }
    if (!event.defaultPrevented) {
      controller.overlay.close({ reason: 'manual', source: 'menu-item', event })
    }
  }
</script>
<button {...rest} {type} {role} onclick={click}>{@render children?.()}</button>
