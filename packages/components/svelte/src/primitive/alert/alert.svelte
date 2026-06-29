<script lang="ts">
  import { alertClassName, type AlertStyleProps } from '@fex/components-styles/alert'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class'>, AlertStyleProps {
    class?: string
    children?: Snippet
  }

  let { class: className, children, variant, ...rest }: Props = $props()
  const classList = $derived(cn(alertClassName({ variant }), className))
</script>

<div {...rest} data-slot="alert" role="alert" class={classList}>
  {@render children?.()}
</div>
