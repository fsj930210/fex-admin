<script lang="ts">
  import Card from '@fex/components-svelte/ui/card'
  import Menu from '@fex/components-svelte/ui/menu'
  import { getMenuNodeEntries, isMenuNodeItem, normalizeMenuKeys, type MenuItem, type MenuKey, type MenuNodeEntry, type MenuRenderItemInfo } from '@fex/components-svelte/primitive/menu'

  const menuItems: MenuItem[] = [
    { key: 'dashboard', label: 'Dashboard', icon: 'D' },
    {
      key: 'system',
      label: 'System',
      icon: 'S',
      children: [
        { key: 'users', label: 'Users', suffix: '24' },
        { key: 'roles', label: 'Roles' },
        { key: 'permissions', label: 'Permissions', disabled: true },
      ],
    },
    {
      key: 'content',
      label: 'Content',
      icon: 'C',
      children: [
        { key: 'articles', label: 'Articles' },
        { key: 'comments', label: 'Comments', suffix: '8' },
      ],
    },
    { type: 'divider' },
    { type: 'group', label: 'Workspace', children: [{ key: 'settings', label: 'Settings' }, { key: 'billing', label: 'Billing' }] },
  ]

  const horizontalItems: MenuItem[] = [
    { key: 'overview', label: 'Overview' },
    { key: 'analytics', label: 'Analytics' },
    { key: 'members', label: 'Members', suffix: '12' },
    { key: 'settings', label: 'Settings' },
  ]

  let expandKeys: MenuKey[] = $state(['system'])
  let selectedKeys: MenuKey[] = $state(['users'])
  let headlessExpandKeys: MenuKey[] = $state(['system'])
  let headlessSelectedKeys: MenuKey[] = $state(['roles'])
  let headlessEntries = $derived(getMenuNodeEntries(menuItems))
  let headlessEntryMap = $derived(new Map(headlessEntries.map((entry) => [entry.key, entry])))

  function headlessInfo(entry: MenuNodeEntry) {
    return {
      entry,
      selected: headlessSelectedKeys.includes(entry.key),
      expanded: headlessExpandKeys.includes(entry.key),
      hasChildren: entry.hasChildren,
      disabled: entry.node.disabled === true,
    }
  }

  function clickHeadless(entry: MenuNodeEntry) {
    const info = headlessInfo(entry)
    if (info.disabled) return
    if (info.hasChildren) {
      headlessExpandKeys = normalizeMenuKeys(
        info.expanded ? headlessExpandKeys.filter((key) => key !== entry.key) : [...headlessExpandKeys, entry.key],
        true,
      )
      return
    }
    headlessSelectedKeys = [entry.key]
  }
</script>

{#snippet minusIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus size-4" aria-hidden="true">
    <path d="M5 12h14" />
  </svg>
{/snippet}

{#snippet plusIcon()}
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus size-4" aria-hidden="true">
    <path d="M5 12h14" />
    <path d="M12 5v14" />
  </svg>
{/snippet}

{#snippet customItem(info: MenuRenderItemInfo)}
  <span class="inline-flex size-4 shrink-0 items-center justify-center text-xs">{info.item.icon ?? '.'}</span>
  <span class="min-w-0 flex-1 truncate">
    {info.item.label}
    {#if info.selected}<span class="ml-2 text-xs text-primary">selected</span>{/if}
  </span>
  {#if info.hasChildren}<span class="text-xs text-muted-foreground">{info.expanded ? 'open' : 'closed'}</span>{/if}
{/snippet}

{#snippet renderHeadlessItems(items: readonly MenuItem[])}
  {#each items as item, index (isMenuNodeItem(item) ? item.key : item.key ?? `${item.type}-${index}`)}
    {#if isMenuNodeItem(item)}
      {@const entry = headlessEntryMap.get(item.key)}
      {#if entry}{@render renderHeadlessNode(entry)}{/if}
    {:else if item.type === 'divider'}
      <div class="my-1 h-px bg-border"></div>
    {:else}
      <div class="py-1">
        {#if item.label}<div class="px-2 py-1 text-xs font-medium text-muted-foreground">{item.label}</div>{/if}
        {@render renderHeadlessItems(item.children)}
      </div>
    {/if}
  {/each}
{/snippet}

{#snippet renderHeadlessNode(entry: MenuNodeEntry)}
  {@const info = headlessInfo(entry)}
  <div>
    <button
      type="button"
      role="menuitem"
      class="flex h-8 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted-background data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
      data-selected={info.selected ? 'true' : 'false'}
      style={`padding-left: ${8 + entry.level * 18}px`}
      onclick={() => clickHeadless(entry)}
    >
      <span class="min-w-0 flex-1 truncate">{entry.node.label}</span>
      {#if info.hasChildren}
        <span class="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground">
          {#if info.expanded}{@render minusIcon()}{:else}{@render plusIcon()}{/if}
        </span>
      {/if}
    </button>
    {#if info.hasChildren}
      <div
        class="grid overflow-hidden transition-[grid-template-rows,opacity] duration-150 ease-out"
        style={`grid-template-rows: ${info.expanded ? '1fr' : '0fr'}; opacity: ${info.expanded ? 1 : 0}`}
      >
        <div class="min-h-0 overflow-hidden">{@render renderHeadlessItems(entry.node.children ?? [])}</div>
      </div>
    {/if}
  </div>
{/snippet}

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Menu</h1>
        <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
          Nested menu body built from shared expansion, selection and tree traversal helpers.
        </p>
      </div>
    </header>

    <div class="grid gap-space-xl lg:grid-cols-2">
      <Card title="Basic" description="Items, nested children, group, divider and disabled state.">
        <Menu items={menuItems} defaultExpandKeys={['system']} defaultSelectedKeys={['dashboard']} />
      </Card>
      <Card title="Horizontal" description="Horizontal displays top-level items; nested popup menus belong to Dropdown or Popover composition.">
        <Menu items={horizontalItems} orientation="horizontal" defaultSelectedKeys={['analytics']} />
      </Card>
      <Card title="Controlled" description="Controlled expanded and selected key arrays.">
        <Menu
          items={menuItems}
          {expandKeys}
          {selectedKeys}
          expandMultiple={false}
          onExpandChange={(keys) => (expandKeys = keys)}
          onSelect={(keys) => (selectedKeys = keys)}
        />
      </Card>
      <Card title="Multiple Selection" description="Leaf item selection can opt into multiple keys.">
        <Menu items={menuItems} defaultExpandKeys={['system', 'content']} defaultSelectedKeys={['users', 'articles']} selectMultiple />
      </Card>
      <Card title="Suffix" description="Right-side content can be provided by data.">
        <Menu items={menuItems} defaultExpandKeys={['system', 'content']} defaultSelectedKeys={['comments']} />
      </Card>
      <Card title="Custom Item" description="renderItem replaces the whole item content area.">
        <Menu items={menuItems} defaultExpandKeys={['system']} renderItem={customItem} />
      </Card>
      <Card title="Headless Helper" description="Primitive tree helpers can drive custom DOM.">
        <nav class="space-y-1" role="menu">
          {@render renderHeadlessItems(menuItems)}
        </nav>
      </Card>
    </div>
  </div>
</main>
