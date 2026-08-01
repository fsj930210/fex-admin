<script lang="ts">
  import { createFloatingOverlay, type FloatingOverlayOptions } from '@fex/components-core/overlay/create-floating-overlay'
  import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
  import type { Snippet } from 'svelte'
  import { getContext, onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { popoverContextKey, registerPopoverDismissRecord, type PopoverContext } from './popover-context'

  interface PopoverProps extends FloatingOverlayOptions {
    children?: Snippet
    trigger?: OverlayTrigger[]
  }

  let {
    children,
    open,
    defaultOpen,
    trigger = ['click'],
    sideOffset = 6,
    hoverCloseDelay,
    arrow = false,
    onOpenChange,
    ...rest
  }: PopoverProps = $props()
  const parentPopover = getContext<PopoverContext | undefined>(popoverContextKey)

  // svelte-ignore state_referenced_locally -- defaultOpen is intentionally read once for uncontrolled initial state.
  // defaultOpen 只用于非受控初始值；后续 open 由 core onOpenChange 回写 localOpen。
  let localOpen = $state(defaultOpen ?? false)
  const triggerElement = { current: null as HTMLElement | null }
  const contentElement = { current: null as HTMLElement | null }
  const arrowElement = { current: null as HTMLElement | null }

  function createOptions(): FloatingOverlayOptions {
    return {
      ...rest,
      open: open ?? localOpen,
      trigger,
      sideOffset,
      hoverCloseDelay,
      arrow,
      onOpenChange(nextOpen, info) {
        if (open === undefined) {
          // 非受控模式先写本地 rune state；受控模式等待外部 open prop 回流。
          localOpen = nextOpen
        }
        onOpenChange?.(nextOpen, info)
      },
    }
  }

  const overlay = createFloatingOverlay(createOptions())
  const snapshot = readableCoreStore(overlay)

  // The core overlay is an external state machine. Keep its options in sync
  // after Svelte has committed prop or local-open changes, never during render.
  $effect(() => {
    overlay.setOptions(createOptions())
  })

  const unregisterDismissRecord = registerPopoverDismissRecord({ arrowElement, overlay, triggerElement, contentElement })

  setContext(popoverContextKey, {
    arrow: () => arrow,
    arrowElement,
    contentElement,
    hoverAncestors: parentPopover
      ? [...(parentPopover.hoverAncestors ?? []), parentPopover.overlay]
      : [],
    overlay,
    snapshot,
    triggerElement,
  })
  onDestroy(() => {
    unregisterDismissRecord()
    overlay.destroy()
  })
</script>

{@render children?.()}
