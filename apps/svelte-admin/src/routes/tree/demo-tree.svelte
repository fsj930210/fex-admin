<script lang="ts">
  import type { TreeController, TreeItem, TreeKey, TreeOptions } from '@fex/components-core/tree/types'
  import { TreeRoot, TreeViewport, TreeVirtualViewport } from '@fex/components-svelte/primitive/tree'
  import { cn } from '@fex/utils'
  import type { Snippet } from 'svelte'
  import DemoTreeRow from './demo-tree-row.svelte'
  import type { DepartmentNode } from './data'

  interface TitleContext {
    item: TreeItem<DepartmentNode>
    tree: TreeController<DepartmentNode>
    isSearching: boolean
    searchKeyword: string
  }

  interface Props extends TreeOptions<DepartmentNode> {
    controller?: TreeController<DepartmentNode>
    checkable?: boolean
    virtual?: boolean
    height?: number
    overscan?: number
    indent?: number
    searchKeyword?: string
    class?: string
    itemClass?: string
    title?: Snippet<[TitleContext]>
  }

  let {
    controller,
    treeData,
    features,
    fieldNames,
    isLeaf,
    checkMode,
    asyncLoader,
    expandedKeys,
    defaultExpandedKeys,
    onExpandedKeysChange,
    selectedKeys,
    defaultSelectedKeys,
    onSelectedKeysChange,
    checkedKeys,
    defaultCheckedKeys,
    onCheckedKeysChange,
    focusedKey,
    defaultFocusedKey,
    onFocusedKeyChange,
    multiple,
    onTreeDataChange,
    checkable = false,
    virtual = false,
    height = 320,
    overscan,
    indent,
    searchKeyword = '',
    class: className,
    itemClass,
    title,
  }: Props = $props()

  const options = $derived.by<TreeOptions<DepartmentNode>>(() => ({
    treeData,
    ...(features === undefined ? {} : { features }),
    ...(fieldNames === undefined ? {} : { fieldNames }),
    ...(isLeaf === undefined ? {} : { isLeaf }),
    ...(checkMode === undefined ? {} : { checkMode }),
    ...(asyncLoader === undefined ? {} : { asyncLoader }),
    ...(expandedKeys === undefined ? {} : { expandedKeys }),
    ...(defaultExpandedKeys === undefined ? {} : { defaultExpandedKeys }),
    ...(onExpandedKeysChange === undefined ? {} : { onExpandedKeysChange }),
    ...(selectedKeys === undefined ? {} : { selectedKeys }),
    ...(defaultSelectedKeys === undefined ? {} : { defaultSelectedKeys }),
    ...(onSelectedKeysChange === undefined ? {} : { onSelectedKeysChange }),
    ...(checkedKeys === undefined ? {} : { checkedKeys }),
    ...(defaultCheckedKeys === undefined ? {} : { defaultCheckedKeys }),
    ...(onCheckedKeysChange === undefined ? {} : { onCheckedKeysChange }),
    ...(focusedKey === undefined ? {} : { focusedKey }),
    ...(defaultFocusedKey === undefined ? {} : { defaultFocusedKey }),
    ...(onFocusedKeyChange === undefined ? {} : { onFocusedKeyChange }),
    ...(multiple === undefined ? {} : { multiple }),
    ...(onTreeDataChange === undefined ? {} : { onTreeDataChange }),
  }))

  let viewport:
    | { scrollToKey(key: TreeKey, settings?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean }): boolean }
    | undefined

  export function scrollToKey(
    key: TreeKey,
    settings?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean },
  ) {
    return viewport?.scrollToKey(key, settings) ?? false
  }
</script>

<TreeRoot {controller} {options} {indent} class={cn('w-full', className)}>
  {#snippet children(tree)}
    {#if virtual}
      <TreeVirtualViewport bind:this={viewport} {height} {overscan}>
        {#snippet children(item)}
          <DemoTreeRow {tree} {item} {checkable} {searchKeyword} {itemClass} {title} />
        {/snippet}
      </TreeVirtualViewport>
    {:else}
      <TreeViewport>
        {#snippet children(item)}
          <DemoTreeRow {tree} {item} {checkable} {searchKeyword} {itemClass} {title} />
        {/snippet}
      </TreeViewport>
    {/if}
  {/snippet}
</TreeRoot>
