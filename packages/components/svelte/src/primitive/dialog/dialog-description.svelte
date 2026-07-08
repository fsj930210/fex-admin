<script lang="ts">
  import { dialogDescriptionClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import { dialogContextKey, type DialogContext } from './dialog-context'
  let { children, class: className }: { children?: Snippet; class?: string } = $props()
  const { descriptionId } = getContext<DialogContext>(dialogContextKey)
</script>
<p id={descriptionId} data-slot="dialog-description" class={cn(dialogDescriptionClassName, className)}>{@render children?.()}</p>
