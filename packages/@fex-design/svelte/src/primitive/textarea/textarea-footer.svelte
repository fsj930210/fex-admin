<script lang="ts">
  import { textareaFooterClassName } from '@fex-design/styles/textarea'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'children' | 'class'> {
    class?: string | undefined
    children?: Snippet | undefined
  }

  let { class: className, children, ...rest }: Props = $props()
</script>

<div {...rest} data-slot="textarea-footer" class={cn(textareaFooterClassName, className)}>
  {@render children?.()}
</div>
