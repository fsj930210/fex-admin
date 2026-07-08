<script lang="ts">
  import { createDialogController, type DialogOptions } from '@fex/components-core/dialog/create-dialog-controller'
  import type { Snippet } from 'svelte'
  import { onDestroy, setContext } from 'svelte'
  import { readableCoreStore } from '../../stores/core-store'
  import { dialogContextKey } from './dialog-context'

  interface DialogProps extends DialogOptions {
    children?: Snippet
  }

  let {
    children,
    open,
    defaultOpen,
    modal = true,
    forceMount,
    closeDelay = 140,
    closeOnOverlayPointer,
    dismiss,
    onOpenChange,
  }: DialogProps = $props()

  // svelte-ignore state_referenced_locally -- defaultOpen is intentionally read once for uncontrolled initial state.
  let localOpen = $state(defaultOpen ?? false)
  const triggerElement = { current: null as HTMLButtonElement | null }
  const dialogId = Math.random().toString(36).slice(2)

  function createOptions(): DialogOptions {
    return {
      open: open ?? localOpen,
      modal,
      forceMount,
      closeDelay,
      closeOnOverlayPointer,
      dismiss,
      onOpenChange(nextOpen, info) {
        if (open === undefined) {
          localOpen = nextOpen
        }
        onOpenChange?.(nextOpen, info)
      },
    }
  }

  const dialog = createDialogController(createOptions())
  const snapshot = readableCoreStore(dialog)

  $effect(() => {
    dialog.setOptions(createOptions())
  })

  setContext(dialogContextKey, {
    contentId: `fex-dialog-content-${dialogId}`,
    descriptionId: `fex-dialog-description-${dialogId}`,
    dialog,
    snapshot,
    titleId: `fex-dialog-title-${dialogId}`,
    triggerElement,
  })

  onDestroy(() => dialog.destroy())
</script>

{@render children?.()}
