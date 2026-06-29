<script setup lang="ts">
import { Kbd, KbdGroup } from '@fex/components-vue/primitive/kbd'
import Card from '@fex/components-vue/ui/card'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">Kbd</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">用于展示键盘按键和快捷键组合。</p>
      </header>

      <Card title="Shortcuts" description="单个按键和组合按键。">
        <div class="flex min-w-0 flex-wrap items-center gap-space-lg"><Kbd>Esc</Kbd><KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup><KbdGroup><Kbd>⌘</Kbd><Kbd>Enter</Kbd></KbdGroup></div>
      </Card>
    </div>
  </main>
</template>
