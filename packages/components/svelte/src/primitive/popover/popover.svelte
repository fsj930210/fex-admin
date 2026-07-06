<script lang="ts">
  import { createFloatingOverlay, type FloatingOverlayOptions } from '@fex/components-core/overlay/create-floating-overlay'
  import type { OverlayTrigger } from '@fex/components-core/overlay/trigger/create-trigger'
  import type { Snippet } from 'svelte'
  import { onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { popoverContextKey, registerPopoverDismissRecord } from './popover-context'

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
    arrow = false,
    onOpenChange,
    ...rest
  }: PopoverProps = $props()

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
      arrow,
      onOpenChange(nextOpen, info) {
        if (open === undefined) {
          // 非受控模式先写本地 rune state；受控模式等待外部 open prop 回流。
          localOpen = nextOpen
          syncOptions()
        }
        onOpenChange?.(nextOpen, info)
      },
    }
  }

  function syncOptions() {
    overlay.setOptions(createOptions())
    return true
  }

  const overlay = createFloatingOverlay(createOptions())
  const snapshot = readableCoreStore(overlay)

  const unregisterDismissRecord = registerPopoverDismissRecord({ arrowElement, overlay, triggerElement, contentElement })

  setContext(popoverContextKey, { arrow: () => arrow, arrowElement, overlay, snapshot, triggerElement, contentElement })
  onDestroy(() => {
    unregisterDismissRecord()
    overlay.destroy()
  })
</script>

{#if syncOptions()}
  {@render children?.()}
{/if}
