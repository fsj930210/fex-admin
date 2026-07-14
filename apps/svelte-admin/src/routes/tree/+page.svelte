<script lang="ts">
  import AsyncDemo from './async-demo.svelte'
  import BasicDemo from './basic-demo.svelte'
  import BatchActionsDemo from './batch-actions-demo.svelte'
  import CheckDemo from './check-demo.svelte'
  import ControlledDemo from './controlled-demo.svelte'
  import DndDemo from './dnd-demo.svelte'
  import MutationDemo from './mutation-demo.svelte'
  import SearchDemo from './search-demo.svelte'
  import VirtualDemo from './virtual-demo.svelte'
</script>

<svelte:head><title>Tree</title></svelte:head>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-sm">
      <a class="text-sm text-muted-foreground hover:text-foreground" href="/">Back home</a>
      <div>
        <h1 class="text-2xl font-semibold text-foreground">Tree</h1>
        <p class="max-w-3xl text-sm leading-6 text-muted-foreground">
          Headless tree state, field mapping, async children, search data, keyboard navigation and virtual rendering.
        </p>
      </div>
    </header>
    <div class="space-y-space-xl">
      <BasicDemo />
      <ControlledDemo />
      <BatchActionsDemo />
      <MutationDemo />
      <DndDemo />
      <CheckDemo />
      <AsyncDemo />
      <SearchDemo />
      <VirtualDemo />
    </div>
  </div>
</main>
