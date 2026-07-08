<script lang="ts">
  import { dialogBodyClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  let { children, class: className }: { children?: Snippet; class?: string } = $props()
</script>
<div data-slot="dialog-body" class={cn(dialogBodyClassName, className)}>{@render children?.()}</div>
