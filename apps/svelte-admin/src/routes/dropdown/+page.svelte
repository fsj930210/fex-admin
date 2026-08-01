<script lang="ts">
  import Card from '@fex/components-svelte/ui/card'
  import BasicDemo from './basic-demo.svelte'
  import CustomPanelDemo from './custom-panel-demo.svelte'
  import CustomTriggerDemo from './custom-trigger-demo.svelte'
  import NestedDemo from './nested-demo.svelte'
</script>
<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><a class="text-sm text-muted-foreground" href="/">Back home</a><div><h1 class="text-2xl font-semibold">Dropdown</h1><p class="mt-2 text-sm text-muted-foreground">Primitive composition of Popover and Menu.</p></div></header><div class="space-y-space-xl"><Card title="Basic" description="A regular action menu."><BasicDemo /></Card><Card title="Nested menus" description="A parent item triggers another Popover."><NestedDemo /></Card><Card title="Custom panel" description="Composable additional content."><CustomPanelDemo /></Card><Card title="Custom trigger" description="The trigger snippet binds to the caller element."><CustomTriggerDemo /></Card></div></div></main>
