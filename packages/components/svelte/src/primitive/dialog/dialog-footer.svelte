<script lang="ts">
  import { dialogFooterClassName } from '@fex/components-styles/dialog'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  let { children, class: className }: { children?: Snippet; class?: string } = $props()
</script>
<div data-slot="dialog-footer" class={cn(dialogFooterClassName, className)}>{@render children?.()}</div>
