<script lang="ts">
  import type { TreeSelectItem } from '@fex-design/core/tree-select/types'
  import type { Snippet } from 'svelte'
  import { getContext } from 'svelte'
  import { treeSelectContextKey, type TreeSelectContext } from './context'
  let { item, toggle, closeOnSelect, clearSearchOnSelect = true, children }: { item: TreeSelectItem; toggle?: boolean; closeOnSelect?: boolean; clearSearchOnSelect?: boolean; children?: Snippet<[{ selected: boolean; select(): void }]> } = $props()
  const context = getContext<TreeSelectContext>(treeSelectContextKey)
  const snapshot = context.snapshot
  const selected = $derived.by(() => { void $snapshot; return context.controller.isSelected(item.value) })
  $effect(() => context.controller.registerItem(item))
  function select() {
    if (item.disabled) return
    if (toggle ?? $snapshot.multiple) context.controller.toggle(item)
    else context.controller.select(item)
    if (clearSearchOnSelect) context.setSearchValue('')
    if (closeOnSelect ?? !(toggle ?? $snapshot.multiple)) context.closePanel()
  }
</script>
{@render children?.({ selected, select })}
