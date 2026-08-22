<script lang="ts">
  import Card from '@fex-design/svelte/ui/card'
  import HorizontalNestedDemo from './horizontal-nested-demo.svelte'
  import MenubarDemo from './menubar-demo.svelte'
  import NavDemo from './nav-demo.svelte'
  import RestoredDemos from './restored-demos.svelte'
</script>
<main data-page="menu" class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground" href="/">Back home</a><div><h1 class="text-2xl font-semibold">Menu</h1><p class="mt-2 text-sm text-muted-foreground">One primitive for navigation, command bars and nested menus.</p></div></header><div class="grid gap-space-xl lg:grid-cols-2"><RestoredDemos /><Card title="Horizontal nested menu" description="Horizontal root navigation with floating submenus at multiple levels."><HorizontalNestedDemo /></Card><Card title="Menubar" description="Command-bar semantics and styling without a separate component family."><MenubarDemo /></Card><Card title="Navigation" description="Custom link triggers with horizontal keyboard navigation."><NavDemo /></Card></div></div></main>
