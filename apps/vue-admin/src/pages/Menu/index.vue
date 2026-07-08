<script setup lang="ts">
import { defineComponent, h, ref, type VNodeChild } from 'vue'
import { useMenu, type MenuNodeEntry } from '@fex/components-vue/primitive/menu'
import { Menu, type MenuItem, type MenuKey, type MenuRenderItemInfo } from '@fex/components-vue/ui/menu'
import Card from '@fex/components-vue/ui/card'

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

const expandKeys = ref<MenuKey[]>(['system'])
const selectedKeys = ref<MenuKey[]>(['users'])
const headlessMenu = useMenu({
  items: () => menuItems,
  defaultExpandKeys: ['system'],
  defaultSelectedKeys: ['roles'],
})

function headlessEntryFor(key: MenuKey) {
  return headlessMenu.nodeItems.value.find((entry) => entry.key === key)
}

function headlessButtonStyle(entry: MenuNodeEntry) {
  const info = headlessMenu.getItemInfo(entry)
  return { paddingLeft: `${8 + info.level * 18}px` }
}

function MinusIcon() {
  return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'lucide lucide-minus-icon lucide-minus size-4', 'aria-hidden': 'true' }, [
    h('path', { d: 'M5 12h14' }),
  ])
}

function PlusIcon() {
  return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: 24, height: 24, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': 2, 'stroke-linecap': 'round', 'stroke-linejoin': 'round', class: 'lucide lucide-plus-icon lucide-plus size-4', 'aria-hidden': 'true' }, [
    h('path', { d: 'M5 12h14' }),
    h('path', { d: 'M12 5v14' }),
  ])
}

function renderCustomItem(info: MenuRenderItemInfo) {
  return [
    h('span', { class: 'inline-flex size-4 shrink-0 items-center justify-center text-xs' }, info.item.icon ?? '.'),
    h('span', { class: 'min-w-0 flex-1 truncate' }, [
      info.item.label,
      info.selected ? h('span', { class: 'ml-2 text-xs text-primary' }, 'selected') : null,
    ]),
    info.hasChildren ? h('span', { class: 'text-xs text-muted-foreground' }, info.expanded ? 'open' : 'closed') : null,
  ]
}

const HeadlessMenu = defineComponent({
  name: 'HeadlessMenu',
  setup() {
    function renderItems(items: readonly MenuItem[]): VNodeChild[] {
      return items.map((item, index) => {
        if ('type' in item) {
          if (item.type === 'divider') {
            return h('div', { key: item.key ?? `divider-${index}`, class: 'my-1 h-px bg-border' })
          }

          return h('div', { key: item.key ?? `group-${index}`, class: 'py-1' }, [
            item.label ? h('div', { class: 'px-2 py-1 text-xs font-medium text-muted-foreground' }, item.label) : null,
            renderItems(item.children),
          ])
        }

        const entry = headlessEntryFor(item.key)
        return entry ? renderNode(entry) : null
      })
    }

    function renderNode(entry: MenuNodeEntry): VNodeChild {
      const info = headlessMenu.getItemInfo(entry)

      return h('div', { key: info.key }, [
        h(
          'button',
          {
            type: 'button',
            role: 'menuitem',
            class: 'flex h-8 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted-background data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary',
            style: headlessButtonStyle(entry),
            'data-selected': info.selected ? 'true' : 'false',
            onClick: () => headlessMenu.clickItem(info),
          },
          [
            h('span', { class: 'min-w-0 flex-1 truncate' }, info.item.label ?? ''),
            info.hasChildren
              ? h('span', { class: 'inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground' }, [
                  info.expanded ? MinusIcon() : PlusIcon(),
                ])
              : null,
          ],
        ),
        info.hasChildren
          ? h('div', {
              class: 'grid overflow-hidden transition-[grid-template-rows,opacity] duration-150 ease-out',
              style: { gridTemplateRows: info.expanded ? '1fr' : '0fr', opacity: info.expanded ? 1 : 0 },
              'aria-hidden': info.expanded ? undefined : 'true',
            }, [h('div', { class: 'min-h-0 overflow-hidden' }, renderItems(info.item.children ?? []))])
          : null,
      ])
    }

    return () => h('nav', { class: 'space-y-1', role: 'menu' }, renderItems(menuItems))
  },
})
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">Menu</h1>
          <p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">
            Nested menu body built from shared expansion, selection and tree traversal helpers.
          </p>
        </div>
      </header>

      <div class="grid gap-space-xl lg:grid-cols-2">
        <Card title="Basic" description="Items, nested children, group, divider and disabled state.">
          <Menu :items="menuItems" :default-expand-keys="['system']" :default-selected-keys="['dashboard']" />
        </Card>
        <Card title="Horizontal" description="Horizontal displays top-level items; nested popup menus belong to Dropdown or Popover composition.">
          <Menu :items="horizontalItems" orientation="horizontal" :default-selected-keys="['analytics']" />
        </Card>
        <Card title="Controlled" description="Controlled expanded and selected key arrays.">
          <Menu
            :items="menuItems"
            :expand-keys="expandKeys"
            :selected-keys="selectedKeys"
            :expand-multiple="false"
            @expand-change="(keys) => (expandKeys = keys)"
            @select="(keys) => (selectedKeys = keys)"
          />
        </Card>
        <Card title="Multiple Selection" description="Leaf item selection can opt into multiple keys.">
          <Menu :items="menuItems" :default-expand-keys="['system', 'content']" :default-selected-keys="['users', 'articles']" select-multiple />
        </Card>
        <Card title="Suffix" description="Right-side content can be provided by data.">
          <Menu :items="menuItems" :default-expand-keys="['system', 'content']" :default-selected-keys="['comments']" />
        </Card>
        <Card title="Custom Item" description="renderItem replaces the whole item content area.">
          <Menu :items="menuItems" :default-expand-keys="['system']" :render-item="renderCustomItem" />
        </Card>
        <Card title="Headless Composable" description="useMenu exposes state and events for custom DOM.">
          <HeadlessMenu />
        </Card>
      </div>
    </div>
  </main>
</template>
