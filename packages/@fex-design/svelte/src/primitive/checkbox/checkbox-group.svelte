<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'

  interface CheckboxGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { children, ...rest }: CheckboxGroupProps = $props()
</script>

<div {...rest}>
  {@render children?.()}
</div>
