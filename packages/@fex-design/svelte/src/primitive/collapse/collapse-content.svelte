<script lang="ts">
  import { collapseContentInnerClassName, collapseContentOuterClassName } from '@fex-design/styles/collapse'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { collapseContextKey, collapseItemContextKey, type CollapseContext, type CollapseItemContext } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
    class?: string
    children?: Snippet
    render?: Snippet<[{ expanded: boolean }]>
  }

  let { class: className, children, render, ...rest }: Props = $props()
  const collapse = getContext<CollapseContext>(collapseContextKey)
  const item = getContext<CollapseItemContext>(collapseItemContextKey)
  const { snapshot } = collapse
  const expanded = $derived($snapshot.expandedKeys.includes(item.value))
  const contentClassName = $derived(cn(collapseContentInnerClassName({ variant: collapse.variant() }), className))
</script>

<div
  data-slot="collapse-content-outer"
  data-state={expanded ? 'open' : 'closed'}
  class={collapseContentOuterClassName}
>
  <div
    {...rest}
    id={item.contentId}
    role="region"
    aria-labelledby={item.triggerId}
    aria-hidden={!expanded}
    data-slot="collapse-content"
    data-state={expanded ? 'open' : 'closed'}
    class={contentClassName}
  >
    {#if render}
      {@render render({ expanded })}
    {:else}
      {@render children?.()}
    {/if}
  </div>
</div>
