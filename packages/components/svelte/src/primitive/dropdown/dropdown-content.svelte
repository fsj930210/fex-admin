<script lang="ts">
  import { popoverMenuContentClassName } from '@fex/components-styles/popover'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import PopoverContent from '../popover/popover-content.svelte'
  import { popoverContextKey, type PopoverContext } from '../popover/popover-context'
  interface Props { children?: Snippet; class?: string; role?: string }
  let { children, class: className, role = 'menu' }: Props = $props()
  const { hoverAncestors, overlay } = getContext<PopoverContext>(popoverContextKey)
  function closeFromItem(event: MouseEvent) {
    const item = event.target instanceof Element
      ? event.target.closest<HTMLElement>('[role="menuitem"]')
      : null
    if (!event.defaultPrevented && item && !item.hasAttribute('aria-haspopup')) {
      ;[...hoverAncestors, overlay].reverse().forEach((current) =>
        current.close({ reason: 'manual', source: 'menu-item', event }),
      )
    }
  }
</script>
<PopoverContent class={cn(popoverMenuContentClassName, className)} {role} onclick={closeFromItem}>{@render children?.()}</PopoverContent>
