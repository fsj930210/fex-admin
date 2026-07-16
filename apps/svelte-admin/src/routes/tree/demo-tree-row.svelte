<script lang="ts">
  import type { TreeController, TreeItem as CoreItem, TreeVisibleItem } from '@fex/components-core/tree/types'
  import { TreeItem, TreeTitle, TreeTrigger } from '@fex/components-svelte/primitive/tree'
  import Checkbox from '@fex/components-svelte/ui/checkbox'
  import Spinner from '@fex/components-svelte/ui/spinner'
  import type { Snippet } from 'svelte'
  import type { DepartmentNode } from './data'

  interface Context {
    item: CoreItem<DepartmentNode>
    tree: TreeController<DepartmentNode>
    isSearching: boolean
    searchKeyword: string
  }

  let { tree, item, checkable = false, searchKeyword = '', itemClass, title }: {
    tree: TreeController<DepartmentNode>
    item: TreeVisibleItem<DepartmentNode>
    checkable?: boolean
    searchKeyword?: string
    itemClass?: string
    title?: Snippet<[Context]>
  } = $props()

  const itemProps = $derived({
    itemKey: item.key,
    controller: tree,
    ...(itemClass === undefined ? {} : { class: itemClass }),
  })
</script>

<TreeItem {...itemProps}>
  {#snippet children(state)}
    <div {...state.itemProps}>
      {#if state.loadState === 'loading'}
        <Spinner size="sm" aria-label="Loading children" />
      {:else}
        <TreeTrigger itemKey={state.item.key} />
      {/if}
      {#if checkable && tree.hasFeature('check')}
        <Checkbox checked={state.checkedState} disabled={state.item.disabled} onclick={(event: MouseEvent) => event.stopPropagation()} onCheckedChange={() => state.actions.toggleChecked()} />
      {/if}
      <TreeTitle>
        {#if title}
          {@render title({ item: state.item, tree, isSearching: Boolean(searchKeyword), searchKeyword })}
        {:else}
          {String(state.item.node.name)}
        {/if}
      </TreeTitle>
    </div>
  {/snippet}
</TreeItem>
