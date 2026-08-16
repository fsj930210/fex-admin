<script lang="ts" generics="T">
  import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
  import { avatarClassName, avatarGroupClassName, avatarGroupOverflowClassName } from '@fex-design/styles/avatar'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  interface Props { items: readonly T[]; maxCount?: number; class?: string; item: Snippet<[T]>; overflow?: Snippet<[number, readonly T[]]> }
  let { items, maxCount, class: className, item, overflow }: Props = $props()
  const split = $derived(splitOverflowItems(items, maxCount))
</script>
<div role="group" data-slot="avatar-group" class={cn(avatarGroupClassName, className)}>
  {#each split.visibleItems as entry, index (index)}{@render item(entry)}{/each}
  {#if split.overflowCount}{#if overflow}{@render overflow(split.overflowCount, split.overflowItems)}{:else}<span data-slot="avatar-group-overflow" class={cn(avatarClassName({ size: 'md', shape: 'circle' }), avatarGroupOverflowClassName)}>+{split.overflowCount}</span>{/if}{/if}
</div>
