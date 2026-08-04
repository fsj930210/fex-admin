<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface ListboxGroupLabelProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { children, ...rest }: ListboxGroupLabelProps = $props()
</script>

<div {...rest} data-slot="listbox-group-label">
  {@render children?.()}
</div>
