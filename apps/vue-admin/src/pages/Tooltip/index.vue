<script setup lang="ts">
import Card from '@fex/components-vue/ui/card'
import BasicDemo from './basic-demo.vue'
import ControlledDemo from './controlled-demo.vue'
import DisabledDemo from './disabled-demo.vue'
import PlacementDemo from './placement-demo.vue'
import StyleDemo from './style-demo.vue'
</script>
<template><main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground" to="/">Back home</RouterLink><div><h1 class="text-2xl font-semibold">Tooltip</h1><p class="mt-2 text-sm text-muted-foreground">Accessible hover and focus descriptions built on the shared floating core.</p></div></header><div class="space-y-space-xl"><Card title="Basic and shortcut" description="Arrow is explicit and content composes Kbd."><BasicDemo /></Card><Card title="Placement" description="Uses the existing floating placements."><PlacementDemo /></Card><Card title="Disabled control" description="A focusable wrapper owns Tooltip events."><DisabledDemo /></Card><Card title="Styles and arrow" description="One variable colors Content and Arrow."><StyleDemo /></Card><Card title="Controlled" description="The parent owns open state."><ControlledDemo /></Card></div></div></main></template>
