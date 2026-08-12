<script lang="ts">
  import type { AnchorItem, AnchorOrientation } from '@fex-design/core/anchor/types'
  import { anchorLinkClassName, anchorListClassName } from '@fex-design/styles/anchor'
  import AnchorList from './anchor-list.svelte'
  import type { Snippet } from 'svelte'

  interface Props {
    items: readonly AnchorItem<string>[]
    activeKeys: readonly string[]
    highlightedKeys: ReadonlySet<string>
    orientation: AnchorOrientation
    level?: number
    onActivate: (item: AnchorItem<string>) => void
    item?: Snippet<[AnchorItem<string>, boolean]>
  }
  let { items, activeKeys, highlightedKeys, orientation, level = 0, onActivate, item: itemSnippet }: Props = $props()
</script>

<ul data-slot="anchor-list" data-level={level} class={anchorListClassName({ orientation, nested: level > 0 })}>
  {#each items as item (item.key)}
    <li data-slot="anchor-item" data-active={activeKeys.includes(item.key) || undefined}>
      <button
        type="button"
        data-slot="anchor-link"
        data-anchor-key={item.key}
        data-state={activeKeys.includes(item.key) ? 'active' : 'inactive'}
        class={anchorLinkClassName({ orientation, active: highlightedKeys.has(item.key) })}
        onclick={() => onActivate(item)}
      >{#if itemSnippet}{@render itemSnippet(item, activeKeys.includes(item.key))}{:else}{item.title}{/if}</button>
      {#if orientation === 'vertical' && item.children?.length}
        <AnchorList items={item.children} {activeKeys} {highlightedKeys} {orientation} level={level + 1} {onActivate} item={itemSnippet} />
      {/if}
    </li>
  {/each}
</ul>
