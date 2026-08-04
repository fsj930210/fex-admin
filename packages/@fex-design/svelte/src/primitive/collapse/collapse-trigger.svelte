<script lang="ts">
  import { collapseIconClassName, collapseTriggerClassName } from '@fex-design/styles/collapse'
  import { cn } from '@fex/utils'
  import { getContext } from 'svelte'
  import type { Snippet } from 'svelte'
  import type { HTMLButtonAttributes } from 'svelte/elements'
  import PrimitiveButton from '../button/button.svelte'
  import ChevronRightIcon from '../../icon/chevron-right.svelte'
  import { collapseContextKey, collapseItemContextKey, type CollapseContext, type CollapseItemContext } from './context'

  interface TriggerBindings extends HTMLButtonAttributes {
    type: 'button'
    id: string
    disabled: boolean
    'aria-expanded': boolean
    'aria-controls': string
    'data-slot': 'collapse-trigger'
    'data-state': 'open' | 'closed'
    class: string
    onclick(event: MouseEvent): void
  }

  interface Props extends Omit<HTMLButtonAttributes, 'class' | 'children'> {
    showIcon?: boolean
    class?: string
    children?: Snippet
    render?: Snippet<[{ props: TriggerBindings, state: { expanded: boolean, disabled: boolean }, iconClass: string }]>
  }

  let { showIcon = true, class: className, onclick, children, render, ...rest }: Props = $props()
  const collapse = getContext<CollapseContext>(collapseContextKey)
  const item = getContext<CollapseItemContext>(collapseItemContextKey)
  const { snapshot } = collapse
  const expanded = $derived($snapshot.expandedKeys.includes(item.value))
  const disabled = $derived(item.disabled() || collapse.isDisabled(item.value))
  const triggerProps: TriggerBindings = $derived({
    ...rest,
    type: 'button',
    id: item.triggerId,
    disabled,
    'aria-expanded': expanded,
    'aria-controls': item.contentId,
    'data-slot': 'collapse-trigger',
    'data-state': expanded ? 'open' : 'closed',
    class: cn(collapseTriggerClassName({ variant: collapse.variant() }), className),
    onclick: (event: MouseEvent) => {
      onclick?.(event)
      if (!event.defaultPrevented && !disabled) collapse.toggle(item.value)
    },
  })
</script>

{#if render}
  {@render render({ props: triggerProps, state: { expanded, disabled }, iconClass: collapseIconClassName })}
{:else}
  <PrimitiveButton {...triggerProps}>
    <span class="min-w-0 flex-1">{@render children?.()}</span>
    {#if showIcon}
      <ChevronRightIcon class={collapseIconClassName} />
    {/if}
  </PrimitiveButton>
{/if}
