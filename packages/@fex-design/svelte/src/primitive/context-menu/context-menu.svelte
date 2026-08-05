<script lang="ts" generics="TPayload = unknown">
  import { createContextMenuController } from '@fex-design/core/overlay/context-menu/create-context-menu-controller'
  import type { ContextMenuOptions } from '@fex-design/core/overlay/context-menu/types'
  import type { Snippet } from 'svelte'
  import { onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { contextMenuContextKey, type ContextMenuContext } from './context-menu-context'

  interface Props extends Omit<ContextMenuOptions<TPayload>, 'onOpenChange'> {
    children?: Snippet
    onOpenChange?: ContextMenuOptions<TPayload>['onOpenChange']
  }
  let { children, open, defaultOpen = false, side = 'right', align = 'start', sideOffset = 2, onOpenChange, ...rest }: Props = $props()
  // svelte-ignore state_referenced_locally -- defaultOpen is intentionally read once for uncontrolled initial state.
  let localOpen = $state(defaultOpen)

  function createOptions(): ContextMenuOptions<TPayload> {
    return {
      ...rest,
      open: open ?? localOpen,
      side,
      align,
      sideOffset,
      onOpenChange(nextOpen, info) {
        if (open === undefined) localOpen = nextOpen
        onOpenChange?.(nextOpen, info)
      },
    }
  }

  const controller = createContextMenuController<TPayload>(createOptions())
  const snapshot = readableCoreStore(controller)
  $effect(() => controller.setOptions(createOptions()))
  setContext(contextMenuContextKey, { controller, snapshot } satisfies ContextMenuContext<TPayload>)
  onDestroy(() => controller.destroy())
</script>
{@render children?.()}
