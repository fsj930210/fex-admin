import { useMenu, type MenuNodeEntry } from '@fex/components-react/primitive/menu'
import { Card } from '@fex/components-react/ui/card'
import { Menu, type MenuItem, type MenuKey } from '@fex/components-react/ui/menu'
import { MinusIcon } from '@fex/components-react/icon/minus'
import { PlusIcon } from '@fex/components-react/icon/plus'
import { useState } from 'react'
import { Link } from 'react-router'

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: <span className="text-xs font-semibold">D</span>,
  },
  {
    key: 'system',
    label: 'System',
    icon: <span className="text-xs font-semibold">S</span>,
    children: [
      { key: 'users', label: 'Users', suffix: <span>24</span> },
      { key: 'roles', label: 'Roles' },
      { key: 'permissions', label: 'Permissions', disabled: true },
    ],
  },
  {
    key: 'content',
    label: 'Content',
    icon: <span className="text-xs font-semibold">C</span>,
    children: [
      { key: 'articles', label: 'Articles' },
      { key: 'comments', label: 'Comments', suffix: <span>8</span> },
    ],
  },
  { type: 'divider' },
  {
    type: 'group',
    label: 'Workspace',
    children: [
      { key: 'settings', label: 'Settings' },
      { key: 'billing', label: 'Billing' },
    ],
  },
]

const horizontalItems: MenuItem[] = [
  { key: 'overview', label: 'Overview' },
  { key: 'analytics', label: 'Analytics' },
  { key: 'members', label: 'Members', suffix: <span>12</span> },
  { key: 'settings', label: 'Settings' },
]

export function MenuPage() {
  const [expandKeys, setExpandKeys] = useState<MenuKey[]>(['system'])
  const [selectedKeys, setSelectedKeys] = useState<MenuKey[]>(['users'])

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">
            Back home
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Menu</h1>
            <p className="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
              Nested menu body built from shared expansion, shared selection and reusable tree traversal helpers.
            </p>
          </div>
        </header>

        <div className="grid gap-space-xl lg:grid-cols-2">
          <Card title="Basic" description="Items, nested children, group, divider and disabled state.">
            <Menu items={menuItems} defaultExpandKeys={['system']} defaultSelectedKeys={['dashboard']} />
          </Card>

          <Card title="Horizontal" description="Horizontal displays top-level items; nested popup menus belong to Dropdown or Popover composition.">
            <Menu
              items={horizontalItems}
              orientation="horizontal"
              defaultSelectedKeys={['analytics']}
            />
          </Card>

          <Card title="Controlled" description="Controlled expanded and selected key arrays.">
            <Menu
              items={menuItems}
              expandKeys={expandKeys}
              selectedKeys={selectedKeys}
              expandMultiple={false}
              onExpandChange={setExpandKeys}
              onSelect={setSelectedKeys}
            />
          </Card>

          <Card title="Multiple Selection" description="Leaf item selection can opt into multiple keys.">
            <Menu
              items={menuItems}
              defaultExpandKeys={['system', 'content']}
              defaultSelectedKeys={['users', 'articles']}
              selectMultiple
            />
          </Card>

          <Card title="Suffix" description="Right-side content can be provided by data or renderSuffix.">
            <Menu
              items={menuItems}
              defaultExpandKeys={['system', 'content']}
              defaultSelectedKeys={['comments']}
              renderSuffix={({ item }) =>
                item.key === 'settings' ? (
                  <span className="rounded-md bg-primary/10 px-1.5 py-0.5 text-primary">new</span>
                ) : undefined
              }
            />
          </Card>

          <Card title="Custom Item" description="renderItem replaces the whole item content area.">
            <Menu
              items={menuItems}
              defaultExpandKeys={['system']}
              renderItem={({ item, selected, expanded, hasChildren }) => (
                <>
                  <span className="inline-flex size-4 shrink-0 items-center justify-center text-xs">
                    {item.icon ?? '.'}
                  </span>
                  <span className="min-w-0 flex-1 truncate">
                    {item.label}
                    {selected ? <span className="ml-2 text-xs text-primary">selected</span> : null}
                  </span>
                  {hasChildren ? (
                    <span className="text-xs text-muted-foreground">{expanded ? 'open' : 'closed'}</span>
                  ) : null}
                </>
              )}
            />
          </Card>

          <Card title="Headless Hook" description="useMenu exposes state and event props for custom DOM.">
            <HeadlessMenu />
          </Card>
        </div>
      </div>
    </main>
  )
}

function HeadlessMenu() {
  const menu = useMenu({
    items: menuItems,
    defaultExpandKeys: ['system'],
    defaultSelectedKeys: ['roles'],
  })
  const nodeEntryMap = new Map(menu.nodeItems.map((entry) => [entry.key, entry]))

  function renderItems(items: readonly MenuItem[], hidden = false) {
    return items.map((item, index) => {
      if ('type' in item) {
        if (item.type === 'divider') {
          return <div key={item.key ?? `divider-${index}`} className="my-1 h-px bg-border" />
        }

        return (
          <div key={item.key ?? `group-${index}`} className="py-1">
            {item.label ? (
              <div className="px-2 py-1 text-xs font-medium text-muted-foreground">{item.label}</div>
            ) : null}
            {renderItems(item.children, hidden)}
          </div>
        )
      }

      const entry = nodeEntryMap.get(item.key)
      if (!entry) {
        return null
      }

      return renderNode(entry, hidden)
    })
  }

  function renderNode(entry: MenuNodeEntry, hidden: boolean) {
    const info = menu.getItemInfo(entry)

    return (
      <div key={info.key}>
        <button
          {...menu.getItemProps(
            entry,
            {
              type: 'button',
              className:
                'flex h-8 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted-background data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary',
              style: { paddingLeft: 8 + info.level * 18 },
            },
            { hidden },
          )}
        >
          <span className="min-w-0 flex-1 truncate">{info.item.label}</span>
          {info.hasChildren ? (
            <span className="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground">
              {info.expanded ? <MinusIcon /> : <PlusIcon />}
            </span>
          ) : null}
        </button>
        {info.hasChildren ? (
          <div
            className="grid overflow-hidden transition-[grid-template-rows,opacity] duration-150 ease-out"
            style={{ gridTemplateRows: info.expanded ? '1fr' : '0fr', opacity: info.expanded ? 1 : 0 }}
            aria-hidden={info.expanded ? undefined : true}
          >
            <div className="min-h-0 overflow-hidden">
              {renderItems(info.item.children ?? [], hidden || !info.expanded)}
            </div>
          </div>
        ) : null}
      </div>
    )
  }

  return <nav {...menu.getRootProps({ className: 'space-y-1' })}>{renderItems(menuItems)}</nav>
}
