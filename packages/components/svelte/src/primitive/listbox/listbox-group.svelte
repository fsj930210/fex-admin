<script lang="ts">
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { getContext } from 'svelte'
  import { listboxContextKey, type ListboxContext } from './context'

  interface ListboxGroupProps extends HTMLAttributes<HTMLDivElement> {
    children?: Snippet
  }

  let { children, ...rest }: ListboxGroupProps = $props()
  const context = getContext<ListboxContext>(listboxContextKey)
</script>

<div {...rest} role="group" data-slot="listbox-group" data-orientation={context.orientation()}>
  {@render children?.()}
</div>
