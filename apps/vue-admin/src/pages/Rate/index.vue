<script setup lang="ts">
import IntegerDemo from './integer-demo.vue'
import FractionDemo from './fraction-demo.vue'
import CustomIconDemo from './custom-icon-demo.vue'
</script>
<template><main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-xl"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink><div><h1 class="text-2xl font-semibold text-foreground">Rate</h1><p class="mt-space-md max-w-2xl text-sm leading-6 text-muted-foreground">A rating primitive with configurable interaction precision and arbitrary fractional display.</p></div></header><div class="space-y-space-xl"><IntegerDemo /><FractionDemo /><CustomIconDemo /></div></div></main></template>
