<script setup lang="ts">
import { Badge, BadgeOverflow } from '@fex-design/vue/primitive/badge'
import Card from '@fex-design/vue/ui/card'

const variants = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const
const overflowItems = ['Design', 'Frontend', 'Backend', 'QA', 'Operations']
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/"
          >Back home</RouterLink
        >
        <h1 class="text-2xl font-semibold text-foreground">Badge</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
          Use badges for compact status, category, and count labels.
        </p>
      </header>
      <div class="grid gap-space-xl"><Card title="Variants" description="Badge visual styles."
        ><div class="flex min-w-0 flex-wrap items-center gap-space-md">
          <Badge v-for="variant in variants" :key="variant" :variant="variant">{{ variant }}</Badge>
        </div></Card
      ><Card title="Overflow" description="Keeps the collection compact without changing its values."><BadgeOverflow :max-count="3"><Badge v-for="item in overflowItems" :key="item" variant="secondary">{{ item }}</Badge></BadgeOverflow></Card></div>
    </div>
  </main>
</template>
