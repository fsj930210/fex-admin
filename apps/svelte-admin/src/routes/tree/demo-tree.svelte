<script lang="ts">
  import type { TreeController, TreeItem, TreeKey, TreeOptions, TreeVisibleItem } from '@fex/components-core/tree/types'
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

  const rootProps = $derived({
    options,
    ...(controller === undefined ? {} : { controller }),
    ...(indent === undefined ? {} : { indent }),
  })
  const virtualProps = $derived({
    height,
    ...(overscan === undefined ? {} : { overscan }),
  })

  let viewport = $state<
    | { scrollToKey(key: TreeKey, settings?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean }): boolean }
    | undefined>()

  export function scrollToKey(
    key: TreeKey,
    settings?: { align?: 'auto' | 'start' | 'center' | 'end'; reveal?: boolean },
  ) {
    return viewport?.scrollToKey(key, settings) ?? false
  }

  function getRowProps(tree: TreeController<DepartmentNode>, item: TreeVisibleItem<DepartmentNode>) {
    return {
      tree,
      item,
      checkable,
      searchKeyword,
      ...(itemClass === undefined ? {} : { itemClass }),
      ...(title === undefined ? {} : { title }),
    }
  }
</script>

<TreeRoot {...rootProps} class={cn('w-full', className)}>
  {#snippet children(tree)}
    {#if virtual}
      <TreeVirtualViewport bind:this={viewport} {...virtualProps} controller={tree}>
        {#snippet children(item)}
          <DemoTreeRow {...getRowProps(tree, item)} />
        {/snippet}
      </TreeVirtualViewport>
    {:else}
      <TreeViewport controller={tree}>
        {#snippet children(item)}
          <DemoTreeRow {...getRowProps(tree, item)} />
        {/snippet}
      </TreeViewport>
    {/if}
  {/snippet}
</TreeRoot>
