<script setup lang="ts">
import { Textarea } from '@fex/components-vue/primitive/textarea'
import Card from '@fex/components-vue/ui/card'
</script>

<template>
  <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
    <div class="mx-auto w-full max-w-5xl space-y-space-xl">
      <header class="space-y-space-md">
        <RouterLink class="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</RouterLink>
        <h1 class="text-2xl font-semibold text-foreground">Textarea</h1>
        <p class="max-w-2xl text-sm leading-6 text-muted-foreground">基础多行输入控件，覆盖普通、禁用和校验态。</p>
      </header>

      <Card title="States" description="常用多行输入状态。">
        <div class="grid gap-space-lg"><Textarea placeholder="记录本次处理说明" /><Textarea default-value="只读多行内容" disabled /><Textarea aria-invalid="true" placeholder="校验失败" /></div>
      </Card>
    </div>
  </main>
</template>
