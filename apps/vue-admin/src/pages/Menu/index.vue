<script setup lang="ts">
import { computed, ref } from 'vue'
import type { MenuNodeEntry } from '@fex/components-vue/primitive/menu'
import { useMenu } from '@fex/components-vue/composables/use-menu'
import { Menu, type MenuItem, type MenuKey } from '@fex/components-vue/ui/menu'
import { MinusIcon } from '@fex/components-vue/icon/minus'
import { PlusIcon } from '@fex/components-vue/icon/plus'
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

const headlessEntries = computed(() => headlessMenu.nodeItems.value.filter((entry) =>
  entry.keyPath.slice(0, -1).every((key) => !headlessEntryFor(key) || headlessMenu.currentExpandKeys.value.includes(key)),
))
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
          <Menu :items="menuItems" :default-expand-keys="['system']">
            <template #item="{ info }">
              <span class="inline-flex size-4 shrink-0 items-center justify-center text-xs">{{ info.item.icon ?? '.' }}</span>
              <span class="min-w-0 flex-1 truncate">{{ info.item.label }}<span v-if="info.selected" class="ml-2 text-xs text-primary">selected</span></span>
              <span v-if="info.hasChildren" class="text-xs text-muted-foreground">{{ info.expanded ? 'open' : 'closed' }}</span>
            </template>
          </Menu>
        </Card>
        <Card title="Headless Composable" description="useMenu exposes state and events for custom DOM.">
          <nav class="space-y-1" role="menu">
            <button v-for="entry in headlessEntries" :key="entry.key" type="button" role="menuitem" class="flex h-8 w-full items-center rounded-md px-2 text-left text-sm hover:bg-muted-background data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary" :style="headlessButtonStyle(entry)" :data-selected="headlessMenu.getItemInfo(entry).selected ? 'true' : 'false'" @click="headlessMenu.clickItem(headlessMenu.getItemInfo(entry))">
              <span class="min-w-0 flex-1 truncate">{{ headlessMenu.getItemInfo(entry).item.label }}</span>
              <span v-if="headlessMenu.getItemInfo(entry).hasChildren" class="inline-flex size-4 shrink-0 items-center justify-center text-muted-foreground"><MinusIcon v-if="headlessMenu.getItemInfo(entry).expanded" class="size-4" /><PlusIcon v-else class="size-4" /></span>
            </button>
          </nav>
        </Card>
      </div>
    </div>
  </main>
</template>
