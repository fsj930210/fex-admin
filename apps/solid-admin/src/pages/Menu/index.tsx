import { A } from '@solidjs/router'
import { Card } from '@fex/components-solid/ui/card'
import { createMenu, type MenuNodeEntry, type MenuNodeItem } from '@fex/components-solid/primitive/menu'
import { Menu, type MenuItem, type MenuKey } from '@fex/components-solid/ui/menu'
import { For, createSignal } from 'solid-js'

const menuItems: MenuItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: <span class="text-xs font-semibold">D</span> },
  {
    key: 'system',
    label: 'System',
    icon: <span class="text-xs font-semibold">S</span>,
    children: [
      { key: 'users', label: 'Users', suffix: <span>24</span> },
      { key: 'roles', label: 'Roles' },
      { key: 'permissions', label: 'Permissions', disabled: true },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    icon: <span class="text-xs font-semibold">C</span>,
    children: [
      { key: 'articles', label: 'Articles' },
      { key: 'comments', label: 'Comments', suffix: <span>8</span> },
    ],
  },
  { type: 'divider' },
  { type: 'group', label: 'Workspace', children: [{ key: 'settings', label: 'Settings' }, { key: 'billing', label: 'Billing' }] },
]

const horizontalItems: MenuItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'members', label: 'Members', suffix: <span>12</span> },
  { key: 'settings', label: 'Settings' },
]

function isMenuNodeItem(item: MenuItem): item is MenuNodeItem {
  return !('type' in item)
}

export function MenuPage() {
  const [expandKeys, setExpandKeys] = createSignal<MenuKey[]>(['system'])
  const [selectedKeys, setSelectedKeys] = createSignal<MenuKey[]>(['users'])

  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</A>
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
            <Menu items={menuItems} expandKeys={expandKeys()} selectedKeys={selectedKeys()} expandMultiple={false} onExpandChange={setExpandKeys} onSelect={setSelectedKeys} />
          </Card>
          <Card title="Multiple Selection" description="Leaf item selection can opt into multiple keys.">
            <Menu items={menuItems} defaultExpandKeys={['system', 'content']} defaultSelectedKeys={['users', 'articles']} selectMultiple />
          </Card>
          <Card title="Suffix" description="Right-side content can be provided by data or renderSuffix.">
            <Menu
              items={menuItems}
              defaultExpandKeys={['system', 'content']}
              defaultSelectedKeys={['comments']}
              renderSuffix={(info) => info.item.key === 'settings' ? <span class="rounded-md bg-primary/10 px-1.5 py-0.5 text-primary">new</span> : undefined}
            />
          </Card>
          <Card title="Custom Item" description="renderItem replaces the whole item content area.">
            <Menu
              items={menuItems}
              defaultExpandKeys={['system']}
              renderItem={({ item, selected, expanded, hasChildren }) => (
                <>
                  <span class="inline-flex size-4 shrink-0 items-center justify-center text-xs">
                    {item.icon ?? '.'}
                  </span>
                  <span class="min-w-0 flex-1 truncate">
                    {item.label}
                    {selected ? <span class="ml-2 text-xs text-primary">selected</span> : null}
                  </span>
                  {hasChildren ? <span class="text-xs text-muted-foreground">{expanded ? 'open' : 'closed'}</span> : null}
                </>
              )}
            />
          </Card>
          <Card title="Headless Primitive" description="createMenu exposes state and events for custom DOM.">
            <HeadlessMenu />
          </Card>
        </div>
      </div>
    </main>
  )
}

function HeadlessMenu() {
  const menu = createMenu({
    items: () => menuItems,
    defaultExpandKeys: ['system'],
    defaultSelectedKeys: ['roles'],
  })
  const entryMap = () => new Map(menu.nodeItems().map((entry) => [entry.key, entry]))

  function renderNode(entry: MenuNodeEntry) {
    const info = () => menu.getItemInfo(entry)
    return (
      <div>
        <button
          type="button"
          role="menuitem"
          class="flex h-8 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted-background data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
          data-selected={info().selected ? 'true' : 'false'}
          style={{ 'padding-left': `${8 + info().level * 18}px` }}
          onClick={() => menu.clickItem(info())}
        >
          <span class="min-w-0 flex-1 truncate">{info().item.label}</span>
          {info().hasChildren ? (
            <span class="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground">
              {info().expanded ? <MinusIcon /> : <PlusIcon />}
            </span>
          ) : null}
        </button>
        {info().hasChildren ? (
          <div
            class="grid overflow-hidden transition-[grid-template-rows,opacity] duration-150 ease-out"
            style={{ 'grid-template-rows': info().expanded ? '1fr' : '0fr', opacity: info().expanded ? 1 : 0 }}
          >
            <div class="min-h-0 overflow-hidden">
              <For each={info().item.children?.filter(isMenuNodeItem) ?? []}>
                {(child) => {
                  const childEntry = entryMap().get(child.key)
                  return childEntry ? renderNode(childEntry) : null
                }}
              </For>
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return (
    <nav role="menu" class="space-y-1">
      <For each={menuItems.filter(isMenuNodeItem)}>
        {(item) => {
          const entry = entryMap().get(item.key)
          return entry ? renderNode(entry) : null
        }}
      </For>
    </nav>
  )
}

function MinusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-minus-icon lucide-minus size-4" aria-hidden="true">
      <path d="M5 12h14" />
    </svg>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-plus-icon lucide-plus size-4" aria-hidden="true">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  )
}
