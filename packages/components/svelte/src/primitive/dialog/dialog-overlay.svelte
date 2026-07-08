<script lang="ts">
  import { dialogOverlayClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { dialogContextKey, type DialogContext } from './dialog-context'

  interface DialogOverlayProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    class?: string
  }

  let { class: className, ...rest }: DialogOverlayProps = $props()
  const { dialog, snapshot } = getContext<DialogContext>(dialogContextKey)
  const classList = $derived(cn(dialogOverlayClassName, className))

  function overlayAction(element: HTMLDivElement) {
    dialog.setOverlayElement(element)
    return {
      destroy() {
        dialog.setOverlayElement(null)
      },
    }
  }
</script>

<div
  {...rest}
  use:overlayAction
  data-slot="dialog-overlay"
  data-state={$snapshot.open ? 'open' : 'closed'}
  data-phase={$snapshot.phase}
  class={classList}
  onclick={(event) => {
    if (event.target === event.currentTarget) {
      dialog.dismiss.overlayPointer({ target: event.target, currentTarget: event.currentTarget, event })
    }
  }}
></div>
