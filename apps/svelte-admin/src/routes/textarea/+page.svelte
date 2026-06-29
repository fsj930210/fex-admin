<script lang="ts">
  import Textarea from '@fex/components-svelte/primitive/textarea'
  import Card from '@fex/components-svelte/ui/card'
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a><h1 class="text-2xl font-semibold text-foreground">Textarea</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">基础多行输入控件，覆盖普通、禁用和校验态。</p></header>
    <Card title="States" description="常用多行输入状态。"><div class="grid gap-space-lg"><Textarea placeholder="记录本次处理说明" /><Textarea value="只读多行内容" disabled /><Textarea aria-invalid placeholder="校验失败" /></div></Card>
  </div>
</main>
