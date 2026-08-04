<script lang="ts">
  import type { ExpansionKey } from '@fex-design/core/expansion/types'
  import { collapseItemClassName } from '@fex-design/styles/collapse'
  import { cn } from '@fex/utils'
  import { getContext, setContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLAttributes } from 'svelte/elements'
  import { collapseContextKey, collapseItemContextKey, type CollapseContext, type CollapseItemContext } from './context'

  interface Props extends Omit<HTMLAttributes<HTMLDivElement>, 'class' | 'children'> {
    value: ExpansionKey
    disabled?: boolean
    class?: string
    children?: Snippet
    render?: Snippet<[{ state: { expanded: boolean, disabled: boolean }, actions: { expand(): void, collapse(): void, toggle(): void } }]>
  }

  let { value, disabled = false, class: className, children, render, ...rest }: Props = $props()
  const collapse = getContext<CollapseContext>(collapseContextKey)
  const { snapshot } = collapse
  const safeValue = String(value).replace(/\s+/g, '-') || crypto.randomUUID()
  const itemDisabled = $derived(disabled || collapse.isDisabled(value))
  const expanded = $derived($snapshot.expandedKeys.includes(value))
  const itemClassName = $derived(cn(collapseItemClassName({ variant: collapse.variant() }), className))
  const actions = {
    expand: () => collapse.expand(value),
    collapse: () => collapse.collapse(value),
    toggle: () => collapse.toggle(value),
  }
  const context: CollapseItemContext = {
    value,
    disabled: () => itemDisabled,
    triggerId: collapse.baseId + '-' + safeValue + '-trigger',
    contentId: collapse.baseId + '-' + safeValue + '-content',
  }
  setContext(collapseItemContextKey, context)
</script>

<div
  {...rest}
  data-slot="collapse-item"
  data-state={expanded ? 'open' : 'closed'}
  data-disabled={itemDisabled || undefined}
  class={itemClassName}
>
  {#if render}
    {@render render({ state: { expanded, disabled: itemDisabled }, actions })}
  {:else}
    {@render children?.()}
  {/if}
</div>
