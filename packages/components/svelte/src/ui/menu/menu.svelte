<script lang="ts">
  import {
    menuDividerClassName,
    menuExpandIconClassName,
    menuGroupClassName,
    menuGroupLabelClassName,
    menuItemClassName,
    menuItemIconClassName,
    menuItemLabelClassName,
    menuItemSuffixClassName,
    menuListClassName,
    menuRootClassName,
    menuSubMenuContentClassName,
    menuSubMenuInnerClassName,
  } from '@fex/components-styles/menu'
  import { cn } from '@fex/utils'
  import {
    isMenuNodeItem,
    type MenuItem,
    type MenuKey,
    type MenuNodeEntry,
    type MenuRenderItemInfo,
  } from '../../primitive/menu/menu'
  import { useMenuState } from './use-menu.svelte'
  import type { Snippet } from 'svelte'

  type PartClass = {
    root?: string
    list?: string
    item?: string
    icon?: string
    label?: string
    suffix?: string
    expandIcon?: string
    submenuContent?: string
    group?: string
    groupLabel?: string
    divider?: string
  }

  let {
    items = [],
    expandKeys,
    defaultExpandKeys,
    expandMultiple = true,
    selectedKeys,
    defaultSelectedKeys,
    selectMultiple = false,
    selectable = true,
    disabled = false,
    orientation = 'vertical',
    indent = 18,
    class: className,
    renderItem,
    renderSuffix,
    onExpandChange,
    onSelect,
  }: {
    items?: MenuItem[]
    expandKeys?: MenuKey[]
    defaultExpandKeys?: MenuKey[]
    expandMultiple?: boolean
    selectedKeys?: MenuKey[]
    defaultSelectedKeys?: MenuKey[]
    selectMultiple?: boolean
    selectable?: boolean
    disabled?: boolean
    orientation?: 'vertical' | 'horizontal'
    indent?: number
    class?: PartClass
    renderItem?: Snippet<[MenuRenderItemInfo]>
    renderSuffix?: Snippet<[MenuRenderItemInfo]>
    onExpandChange?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
    onSelect?: (keys: MenuKey[], info: MenuRenderItemInfo) => void
  } = $props()

  const menu = useMenuState(() => ({
    items,
    expandKeys,
    defaultExpandKeys,
    expandMultiple,
    selectedKeys,
    defaultSelectedKeys,
    selectMultiple,
    selectable,
    disabled,
    onExpandChange,
    onSelect,
  }))

  function textOf(value: string | import('svelte').Snippet | undefined) {
    return typeof value === 'string' ? value : ''
  }
</script>

{#snippet chevron()}
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="m9 18 6-6-6-6" />
  </svg>
{/snippet}

{#snippet renderNode(entry: MenuNodeEntry, hidden: boolean)}
  {@const info = menu.getItemInfo(entry)}
  <div data-slot="menu-node">
    <button
      type="button"
      role="menuitem"
      tabindex={info.disabled || hidden ? -1 : 0}
      aria-disabled={info.disabled || undefined}
      aria-expanded={info.hasChildren ? info.expanded : undefined}
      data-slot="menu-item"
      data-selected={info.selected ? 'true' : 'false'}
      data-expanded={info.expanded ? 'true' : 'false'}
      data-disabled={info.disabled ? 'true' : undefined}
      class={cn(menuItemClassName({ orientation }), className?.item)}
      style={orientation === 'vertical' ? `padding-left: calc(var(--menu-item-padding-x) + ${info.level * indent}px)` : undefined}
      onclick={() => !hidden && menu.clickItem(info)}
      onkeydown={(event) => {
        if (hidden || (event.key !== 'Enter' && event.key !== ' ')) return
        event.preventDefault()
        menu.clickItem(info)
      }}
    >
      {#if renderItem}
        {@render renderItem(info)}
      {:else}
        {#if info.item.icon}
          <span data-slot="menu-item-icon" class={cn(menuItemIconClassName, className?.icon)}>{textOf(info.item.icon)}</span>
        {/if}
        <span data-slot="menu-item-label" class={cn(menuItemLabelClassName, className?.label)}>{textOf(info.item.label)}</span>
        {#if renderSuffix}
          <span data-slot="menu-item-suffix" class={cn(menuItemSuffixClassName, className?.suffix)}>{@render renderSuffix(info)}</span>
        {:else if info.item.suffix}
          <span data-slot="menu-item-suffix" class={cn(menuItemSuffixClassName, className?.suffix)}>{textOf(info.item.suffix)}</span>
        {/if}
        {#if info.hasChildren}
          <span data-slot="menu-expand-icon" aria-hidden="true" class={cn(menuExpandIconClassName, className?.expandIcon)}>{@render chevron()}</span>
        {/if}
      {/if}
    </button>
    {#if info.hasChildren}
      <div class={cn(menuSubMenuContentClassName, className?.submenuContent)} data-expanded={info.expanded ? 'true' : 'false'} aria-hidden={info.expanded ? undefined : 'true'}>
        <div class={menuSubMenuInnerClassName}>{@render renderItems(info.item.children ?? [], hidden || !info.expanded)}</div>
      </div>
    {/if}
  </div>
{/snippet}

{#snippet renderItems(menuItems: readonly MenuItem[], hidden: boolean)}
  {#each menuItems as item, index (isMenuNodeItem(item) ? item.key : item.key ?? `${item.type}-${index}`)}
    {#if isMenuNodeItem(item)}
      {@const entry = menu.entryMap.get(item.key)}
      {#if entry}{@render renderNode(entry, hidden)}{/if}
    {:else if item.type === 'divider'}
      <div role="separator" data-slot="menu-divider" class={cn(menuDividerClassName, className?.divider)}></div>
    {:else}
      <div role="group" data-slot="menu-group" class={cn(menuGroupClassName, className?.group)}>
        {#if item.label}<div data-slot="menu-group-label" class={cn(menuGroupLabelClassName, className?.groupLabel)}>{textOf(item.label)}</div>{/if}
        {@render renderItems(item.children, hidden)}
      </div>
    {/if}
  {/each}
{/snippet}

<div role="menu" data-slot="menu" data-orientation={orientation} class={cn(menuRootClassName({}), className?.root)}>
  <div role="group" data-slot="menu-list" data-orientation={orientation} class={cn(menuListClassName({ orientation }), className?.list)}>
    {@render renderItems(items, false)}
  </div>
</div>
