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
  // 如果把 defaultOpen 继续当响应式来源，会把“默认值”误当成受控状态。
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
          // 非受控模式先写本地 rune state，再同步 core options，保证 snapshot 的 open 来源一致。
          // 受控模式必须等待外部 open prop 回流，不能在 adapter 内创建第二份真实状态。
          localOpen = nextOpen
          syncOptions()
        }
        onOpenChange?.(nextOpen, info)
      },
    }
  }

  function syncOptions() {
    overlay.setOptions(createOptions())
  }

  const overlay = createFloatingOverlay(createOptions())
  const snapshot = readableCoreStore(overlay)

  $effect(() => {
    // 这个 effect 只负责把 Svelte props/rune 状态同步到外部 core 实例。
    // 用户交互仍然走 overlay.trigger/onOpenChange，不通过监听 state 串业务逻辑。
    syncOptions()
  })

  const unregisterDismissRecord = registerPopoverDismissRecord({ arrowElement, overlay, triggerElement, contentElement })

  setContext(popoverContextKey, { arrow: () => arrow, arrowElement, overlay, snapshot, triggerElement, contentElement })
  onDestroy(() => {
    unregisterDismissRecord()
    overlay.destroy()
  })
</script>

{@render children?.()}
