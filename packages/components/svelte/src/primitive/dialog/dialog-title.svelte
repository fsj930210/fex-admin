<script lang="ts">
  import { dialogTitleClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import { dialogContextKey, type DialogContext } from './dialog-context'
  let { children, class: className }: { children?: Snippet; class?: string } = $props()
  const { titleId } = getContext<DialogContext>(dialogContextKey)
</script>
<h2 id={titleId} data-slot="dialog-title" class={cn(dialogTitleClassName, className)}>{@render children?.()}</h2>
