<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { dialogContextKey, type DialogContext } from './dialog-context'

  type DialogTriggerProps = Omit<HTMLButtonAttributes, 'children'> & {
    children?: Snippet<[
      {
        action: (element: HTMLButtonElement) => { destroy: () => void }
        props: HTMLButtonAttributes
        state: ReturnType<DialogContext['dialog']['getSnapshot']>
      },
    ]>
  }

  let { children, type = 'button', ...rest }: DialogTriggerProps = $props()
  const { contentId, dialog, snapshot, triggerElement } = getContext<DialogContext>(dialogContextKey)

  function action(element: HTMLButtonElement) {
    triggerElement.current = element
    return {
      destroy() {
        if (triggerElement.current === element) {
          triggerElement.current = null
        }
      },
    }
  }

  const triggerProps = $derived({
    ...rest,
    type,
    'aria-haspopup': 'dialog',
    'aria-expanded': $snapshot.open,
    'aria-controls': $snapshot.open ? contentId : undefined,
    'data-state': $snapshot.open ? 'open' : 'closed',
    onclick: (event: MouseEvent) => dialog.toggle({ reason: 'trigger-click', event }),
  } satisfies HTMLButtonAttributes)
</script>

{@render children?.({ action, props: triggerProps, state: $snapshot })}
