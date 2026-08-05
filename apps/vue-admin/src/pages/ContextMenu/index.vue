<script setup lang="ts">
import Card from '@fex-design/vue/ui/card'
import BasicDemo from './basic-demo.vue'
import DataTableDemo from './data-table-demo.vue'
import TreeDemo from './tree-demo.vue'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink>
        <div>
          <h1 class="text-2xl font-semibold text-foreground">ContextMenu</h1>
          <p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
            Right-click primitive based on pointer virtual references. Trigger slot props bind to existing elements,
            so tree rows, table headers and custom panels keep their DOM shape.
          </p>
        </div>
      </header>
      <div class="space-y-space-xl">
        <Card title="Basic right click" description="Trigger slot props bind directly to the caller element; no wrapper is inserted.">
          <BasicDemo />
        </Card>
        <Card title="Tree node menu" description="Each tree row stays the actual trigger target, preserving indentation and row structure.">
          <TreeDemo />
        </Card>
        <Card title="Data table header and row menus" description="The same ContextMenuRoot can serve header cells and body rows with different payloads.">
          <DataTableDemo />
        </Card>
      </div>
    </div>
  </main>
</template>
