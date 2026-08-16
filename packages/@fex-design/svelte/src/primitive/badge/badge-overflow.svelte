<script lang="ts" generics="T">
  import { splitOverflowItems } from '@fex-design/core/collection/split-overflow-items'
  import { badgeOverflowClassName } from '@fex-design/styles/badge'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import Badge from './badge.svelte'
  interface Props { items: readonly T[]; maxCount?: number; class?: string; item: Snippet<[T]>; overflow?: Snippet<[number, readonly T[]]> }
  let { items, maxCount, class: className, item, overflow }: Props = $props()
  const split = $derived(splitOverflowItems(items, maxCount))
</script>
<div data-slot="badge-overflow" class={cn(badgeOverflowClassName, className)}>
  {#each split.visibleItems as entry, index (index)}{@render item(entry)}{/each}
  {#if split.overflowCount}{#if overflow}{@render overflow(split.overflowCount, split.overflowItems)}{:else}<Badge variant="secondary">+{split.overflowCount}</Badge>{/if}{/if}
</div>
