<script lang="ts">
  import {
    listboxItemClassName,
    listboxItemContentClassName,
    listboxItemDescriptionClassName,
    listboxItemIndicatorClassName,
    listboxItemTitleClassName,
  } from '@fex/components-styles/listbox'
  import { cn } from '@fex/utils'
  import type { SelectionValue } from '@fex/components-core/selection/types'
  import type { Snippet } from 'svelte'
  import CheckIcon from '../../icon/check.svelte'
  import PrimitiveListboxItem from '../../primitive/listbox/listbox-item.svelte'
  import PrimitiveListboxItemIndicator from '../../primitive/listbox/listbox-item-indicator.svelte'

  let {
    class: className,
    value,
    title,
    description,
    children,
    ...rest
  }: {
    class?: string
    value: SelectionValue
    title?: string
    description?: string
    children?: Snippet
    [key: string]: unknown
  } = $props()
</script>

<PrimitiveListboxItem {...rest} {value} class={cn(listboxItemClassName({}), className)}>
  {#if children}
    {@render children()}
  {:else}
    <span class={listboxItemContentClassName}>
      <span class={listboxItemTitleClassName}>{title}</span>
      {#if description}
        <span class={listboxItemDescriptionClassName}>{description}</span>
      {/if}
    </span>
    <PrimitiveListboxItemIndicator class={listboxItemIndicatorClassName}>
      <CheckIcon />
    </PrimitiveListboxItemIndicator>
  {/if}
</PrimitiveListboxItem>
