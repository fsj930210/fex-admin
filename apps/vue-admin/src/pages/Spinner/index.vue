<script setup lang="ts">
import { Spinner } from '@fex/components-vue/ui/spinner'
import Card from '@fex/components-vue/ui/card'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink><h1 class="text-2xl font-semibold text-foreground">Spinner</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Use spinners for local loading feedback.</p></header><Card title="Sizes" description="Available spinner sizes."><div class="flex min-w-0 flex-wrap items-center gap-space-lg"><Spinner size="sm" aria-label="Loading" /><Spinner size="md" aria-label="Loading" /><Spinner size="lg" aria-label="Loading" /></div></Card></div></main>
</template>
