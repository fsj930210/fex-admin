<script setup lang="ts">
import { Alert, AlertAction, AlertDescription, AlertTitle } from '@fex/components-vue/primitive/alert'
import { Badge } from '@fex/components-vue/ui/badge'
import Card from '@fex/components-vue/ui/card'

const variants = ['default', 'success', 'warning', 'destructive'] as const
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl"><div class="mx-auto w-full max-w-5xl space-y-space-xl"><header class="space-y-space-md"><RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</RouterLink><h1 class="text-2xl font-semibold text-foreground">Alert</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">Show status messages with clear semantics.</p></header><Card title="Primitive" description="Structure with icon, title, description, and action."><div class="grid gap-space-md"><Alert v-for="variant in variants" :key="variant" :variant="variant"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg><AlertTitle>{{ variant }}</AlertTitle><AlertDescription>The current task is in {{ variant }} state. Continue with the page action.</AlertDescription><AlertAction><Badge variant="outline">New</Badge></AlertAction></Alert></div></Card></div></main>
</template>
