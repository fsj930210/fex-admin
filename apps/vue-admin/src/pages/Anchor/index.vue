<script setup lang="ts">
import AnchorDemo from './anchor-demo.vue'
import HorizontalDemo from './horizontal-demo.vue'
</script>
<template><main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink><h1 class="text-2xl font-semibold">Anchor</h1><p class="text-sm text-muted-foreground">Navigate and track sections in a scroll container.</p></header><div class="grid gap-space-xl"><AnchorDemo /><HorizontalDemo /></div></div></main></template>

