<script lang="ts">
  import Card from '@fex-design/svelte/ui/card'
  import BasicDemo from './basic-demo.svelte'
  import DataTableDemo from './data-table-demo.svelte'
  import TreeDemo from './tree-demo.svelte'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">ContextMenu</h1>
        <p class="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
          Right-click primitive based on pointer virtual references. Trigger snippets bind to existing elements, so
          tree rows, table headers and custom panels keep their DOM shape.
        </p>
      </div>
    </header>
    <div class="space-y-space-xl">
      <Card title="Basic right click" description="Trigger snippets bind directly to the caller element; no wrapper is inserted.">
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
