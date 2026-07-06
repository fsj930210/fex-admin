<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface ListboxItemIndicatorProps extends HTMLAttributes<HTMLSpanElement> {
    children?: Snippet
  }

  let { children, ...rest }: ListboxItemIndicatorProps = $props()
</script>

<span {...rest} aria-hidden="true" data-slot="listbox-item-indicator">
  {#if children}
    {@render children()}
  {/if}
</span>
