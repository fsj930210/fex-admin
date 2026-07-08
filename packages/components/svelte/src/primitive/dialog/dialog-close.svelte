<script lang="ts">
  import { dialogCloseClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { dialogContextKey, type DialogContext } from './dialog-context'
  interface DialogCloseRenderProps extends HTMLButtonAttributes {
    'data-slot': 'dialog-close'
  }

  interface DialogCloseProps extends Omit<HTMLButtonAttributes, 'children'> {
    button?: Snippet<[DialogCloseRenderProps]>
    children?: Snippet
  }
  let { button, children, class: className, type = 'button', ...rest }: DialogCloseProps = $props()
  const { dialog } = getContext<DialogContext>(dialogContextKey)
  const closeProps = $derived({
    ...rest,
    type,
    'data-slot': 'dialog-close',
    class: cn(dialogCloseClassName, className),
    onclick: (event: MouseEvent) => dialog.close({ reason: 'manual', source: 'close-button', event }),
  } satisfies DialogCloseRenderProps)
</script>

{#if button}
  {@render button(closeProps)}
{:else}
  <button {...closeProps}>{@render children?.()}</button>
{/if}
