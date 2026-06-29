<script setup lang="ts">
import { Input } from '@fex/components-vue/primitive/input'
import Card from '@fex/components-vue/ui/card'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">Input</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">基础单行输入控件，覆盖原生受控、非受控、禁用和校验态。</p>
      </header>

      <Card title="States" description="常用输入状态。">
        <div class="grid gap-space-lg md:grid-cols-2"><Input placeholder="admin@example.com" type="email" /><Input default-value="只读内容" disabled /><Input aria-invalid="true" placeholder="校验失败" /><Input type="file" /></div>
      </Card>
    </div>
  </main>
</template>
