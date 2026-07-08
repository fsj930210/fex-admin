<script lang="ts">
  import { dialogContentClassName, type DialogStyleProps } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import type { Snippet } from 'svelte'
  import { dialogContextKey, type DialogContext } from './dialog-context'

  interface DialogContentProps extends Omit<HTMLAttributes<HTMLDivElement>, 'class'> {
    children?: Snippet
    class?: string
    size?: DialogStyleProps['size']
  }

  let { class: className, children, size, ...rest }: DialogContentProps = $props()
  const { contentId, descriptionId, dialog, snapshot, titleId } = getContext<DialogContext>(dialogContextKey)
  const classList = $derived(cn(dialogContentClassName({ size }), className))

  function contentAction(element: HTMLDivElement) {
    dialog.setLayerElement(element)
    return {
      destroy() {
        dialog.setLayerElement(null)
      },
    }
  }
</script>

{#if $snapshot.mounted}
  <div
    {...rest}
    use:contentAction
    id={contentId}
    role="dialog"
    aria-modal="true"
    aria-labelledby={titleId}
    aria-describedby={descriptionId}
    tabindex="-1"
    data-slot="dialog-content"
    data-state={$snapshot.open ? 'open' : 'closed'}
    data-phase={$snapshot.phase}
    class={classList}
    onkeydown={(event) => {
      if (event.key === 'Escape') {
        dialog.dismiss.escapeKey({ target: event.target, currentTarget: event.currentTarget, event })
      }
    }}
  >
    {@render children?.()}
  </div>
{/if}
