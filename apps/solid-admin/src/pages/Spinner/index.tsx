import { Spinner } from '@fex/components-solid/primitive/spinner'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For } from 'solid-js'

const sizes = ['sm', 'md', 'lg'] as const

export function SpinnerPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</A><h1 class="text-2xl font-semibold text-foreground">Spinner</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">用于局部加载反馈。</p></header>
        <Card title="Sizes" description="覆盖全部公开 size。"><div class="flex min-w-0 flex-wrap items-center gap-space-lg"><For each={sizes}>{(size) => <Spinner size={size} aria-label={`${size} loading`} />}</For></div></Card>
      </div>
    </main>
  )
}
