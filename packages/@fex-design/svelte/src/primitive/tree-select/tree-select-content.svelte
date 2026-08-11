<script lang="ts">
  import type { Snippet } from 'svelte'
  import PopoverContent from '../popover/popover-content.svelte'
  import PopoverPortal from '../popover/popover-portal.svelte'
  let { children, ...rest }: { children?: Snippet; [key: string]: unknown } = $props()
</script>
<PopoverPortal><PopoverContent {...rest}>{@render children?.()}</PopoverContent></PopoverPortal>
