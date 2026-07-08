<script lang="ts">
  import { dialogHeaderClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  let { children, class: className }: { children?: Snippet; class?: string } = $props()
</script>
<div data-slot="dialog-header" class={cn(dialogHeaderClassName, className)}>{@render children?.()}</div>
