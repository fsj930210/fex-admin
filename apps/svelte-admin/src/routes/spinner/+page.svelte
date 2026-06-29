<script lang="ts">
  import Spinner from '@fex/components-svelte/primitive/spinner'
  import Card from '@fex/components-svelte/ui/card'
  const sizes = ['sm', 'md', 'lg'] as const
</script>

<main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
  <div class="mx-auto w-full max-w-5xl space-y-space-xl">
    <header class="space-y-space-md"><a class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</a><h1 class="text-2xl font-semibold text-foreground">Spinner</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">用于局部加载反馈。</p></header>
    <Card title="Sizes" description="覆盖全部公开 size。"><div class="flex min-w-0 flex-wrap items-center gap-space-lg">{#each sizes as size}<Spinner {size} aria-label={`${size} loading`} />{/each}</div></Card>
  </div>
</main>
