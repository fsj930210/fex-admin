<script lang="ts">
  import { asyncLoadFeature, checkFeature, expansionFeature, selectionFeature } from '@fex-design/core'
  import type { TreeItem, TreeKey } from '@fex-design/core/tree/types'
  import type { TreeSelectItem, TreeSelectValue } from '@fex-design/core/tree-select/types'
  import InputRoot from '@fex-design/svelte/primitive/input'
  import InputControl from '@fex-design/svelte/primitive/input-control'
  import InputClear from '@fex-design/svelte/primitive/input-clear'
  import TreeSelectRoot from '@fex-design/svelte/primitive/tree-select'
  import TreeSelectTrigger from '@fex-design/svelte/primitive/tree-select-trigger'
  import TreeSelectContent from '@fex-design/svelte/primitive/tree-select-content'
  import TreeSelectOption from '@fex-design/svelte/primitive/tree-select-option'
  import { treeSelectTagClassName, treeSelectTagOverflowClassName, treeSelectTagRemoveClassName } from '@fex-design/styles/select'
  import CloseIcon from '@fex-design/svelte/icon/close'
  import type { Snippet } from 'svelte'
  import DemoTree from '../tree/demo-tree.svelte'
  import { departmentFieldNames, type DepartmentNode } from '../tree/data'

  interface Props {
    treeData: readonly DepartmentNode[]
    value?: TreeSelectValue | readonly TreeSelectValue[] | undefined
    defaultValue?: TreeSelectValue | readonly TreeSelectValue[] | undefined
    multiple?: boolean
    checkStrictly?: boolean
    maxTagCount?: number
    searchable?: boolean
    searchValue?: string
    contentActive?: boolean
    expandedKeys?: readonly TreeKey[]
    asyncLoader?: (item: TreeItem<DepartmentNode>, context: { signal: AbortSignal }) => Promise<readonly DepartmentNode[]>
    onTreeDataChange?: (nodes: readonly DepartmentNode[]) => void
    onExpandedKeysChange?: (keys: readonly TreeKey[]) => void
    onChange?: (value: TreeSelectValue | TreeSelectValue[] | undefined) => void
    onSearch?: (value: string) => void
    onClear?: () => void
    content?: Snippet
  }
  let { treeData, value, defaultValue, multiple = false, checkStrictly = false, maxTagCount = 2, searchable = false, searchValue, contentActive = false, expandedKeys, asyncLoader, onTreeDataChange, onExpandedKeysChange, onChange, onSearch, onClear, content }: Props = $props()
  function toItems(nodes: readonly DepartmentNode[]): TreeSelectItem<DepartmentNode>[] { return nodes.flatMap((node) => [{ value: node.id, label: node.name, node }, ...toItems(node.childrenList ?? [])]) }
  const features = $derived([
    expansionFeature(expandedKeys === undefined ? { defaultExpandedKeys: ['company', 'engineering', 'finance', 'product'] } : {}),
    ...(asyncLoader ? [asyncLoadFeature({ loadChildren: asyncLoader })] : []),
    ...(multiple ? [checkFeature({ mode: checkStrictly ? 'strict' : 'cascade' })] : [selectionFeature()]),
  ])
</script>

<TreeSelectRoot items={toItems(treeData)} {value} {defaultValue} {multiple} {searchable} {searchValue} onChange={(next) => onChange?.(next)} onSearchValueChange={(next) => onSearch?.(next)}>
  {#snippet children(root)}
    <TreeSelectTrigger>
      {#snippet children(state)}
        <div use:state.trigger.action {...state.trigger.props} class="w-80">
          <InputRoot value={state.inputProps.value} onClear={() => { state.clear(); onClear?.() }}>
            {#if multiple}{#if state.selectedItems.length <= maxTagCount}{#each state.selectedItems as item (item.value)}<span class={`${treeSelectTagClassName} ml-1.5`}>{item.label}<button type="button" aria-label={`删除 ${item.label}`} class={treeSelectTagRemoveClassName} onpointerdown={event => event.preventDefault()} onclick={event => { event.stopPropagation(); root.controller.setValues(root.state.values.filter(value => value !== item.value)) }}><CloseIcon /></button></span>{/each}{:else}<span class={`${treeSelectTagOverflowClassName} ml-1.5`}>已选择 {state.selectedItems.length} 项</span>{/if}{/if}
            <InputControl readonly={state.inputProps.readonly} placeholder={state.selectedItems.length ? undefined : searchable ? '搜索部门' : '请选择部门'} oninput={state.inputProps.oninput} onfocus={state.inputProps.onfocus} onclick={state.inputProps.onclick} />
            <InputClear forceMount={state.selectedItems.length > 0 || Boolean(searchValue)} aria-label="清除" onclick={(event) => { event.stopPropagation(); event.preventDefault(); state.clear(); onClear?.() }} />
          </InputRoot>
        </div>
      {/snippet}
    </TreeSelectTrigger>
    <TreeSelectContent class="w-80 p-space-sm">
      {#if contentActive && content}
        {@render content()}
      {:else}
        <DemoTree
          {treeData}
          fieldNames={departmentFieldNames}
          isLeaf={(node) => node.childCount === 0}
          {features}
          selectedKeys={multiple ? [] : root.state.values}
          checkedKeys={multiple ? root.state.values : undefined}
          onCheckedKeysChange={multiple ? (keys, meta) => { if (!checkStrictly) { root.controller.setValues(keys); return }; const next = new Set(root.state.values); meta.changedKeys.forEach((key) => keys.includes(key) ? next.add(key) : next.delete(key)); root.controller.setValues([...next]) } : undefined}
          checkable={multiple}
          {expandedKeys}
          {onExpandedKeysChange}
          {onTreeDataChange}
          itemClass="cursor-pointer data-[disabled=true]:cursor-not-allowed"
          searchKeyword={searchValue ?? ''}
        >
          {#snippet title({ item })}
            <TreeSelectOption item={{ value: item.key, label: item.node.name, node: item.node, disabled: item.disabled }}>
              {#snippet children(option)}<button type="button" disabled={item.disabled} data-selected={!multiple && option.selected || undefined} class="rounded-sm px-space-xs text-left data-[selected]:bg-accent disabled:cursor-not-allowed" onclick={(event) => { event.stopPropagation(); option.select() }}>{item.node.name}</button>{/snippet}
            </TreeSelectOption>
          {/snippet}
        </DemoTree>
      {/if}
    </TreeSelectContent>
  {/snippet}
</TreeSelectRoot>
