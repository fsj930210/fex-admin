<script lang="ts">
  import { buttonPrimitiveClassName } from '@fex/components-styles/button'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface ButtonProps extends Omit<HTMLButtonAttributes, 'class'> {
    action?: (element: HTMLButtonElement) => { destroy?: () => void } | void
    class?: string
    children?: Snippet
  }

  let { action, class: className, children, type = 'button', ...rest }: ButtonProps = $props()
  const classList = $derived(cn(buttonPrimitiveClassName, className))

  function buttonAction(element: HTMLButtonElement) {
    const cleanup = action?.(element)
    return {
      destroy() {
        cleanup?.destroy?.()
      },
    }
  }
</script>

<button {...rest} class={classList} data-slot="button" {type} use:buttonAction>
  {@render children?.()}
</button>
