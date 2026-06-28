<script lang="ts">
  import { buttonPrimitiveClassName } from '@fex/components-styles/button'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'

  interface ButtonProps extends Omit<HTMLButtonAttributes, 'class'> {
    class?: string
    children?: Snippet
  }

  let { class: className, children, type = 'button', ...rest }: ButtonProps = $props()
  const classList = $derived(cn(buttonPrimitiveClassName, className))
</script>

<button {...rest} class={classList} data-slot="button" {type}>
  {@render children?.()}
</button>
