<script setup lang="ts">
import Card from '@fex/components-vue/ui/card'
import BasicDemo from './basic-demo.vue'
import CustomPanelDemo from './custom-panel-demo.vue'
import CustomTriggerDemo from './custom-trigger-demo.vue'
import NestedDemo from './nested-demo.vue'
</script>

<template><main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground" to="/">Back home</RouterLink><div><h1 class="text-2xl font-semibold">Dropdown</h1><p class="mt-2 text-sm text-muted-foreground">Primitive composition of Popover and Menu.</p></div></header><div class="space-y-space-xl"><Card title="Basic" description="A regular action menu."><BasicDemo /></Card><Card title="Nested menus" description="Each parent item triggers another Popover containing Menu."><NestedDemo /></Card><Card title="Custom panel" description="Composable additional content."><CustomPanelDemo /></Card><Card title="Custom trigger" description="Trigger slot binds to the caller element."><CustomTriggerDemo /></Card></div></div></main></template>
