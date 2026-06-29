import { Alert, AlertAction, AlertDescription, AlertTitle } from '@fex/components-solid/primitive/alert'
import { Badge } from '@fex/components-solid/primitive/badge'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'
import { For } from 'solid-js'

const variants = ['default', 'success', 'warning', 'info', 'destructive'] as const

export function AlertPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md"><A class="text-sm text-muted-foreground hover:text-foreground" href="/">返回首页</A><h1 class="text-2xl font-semibold text-foreground">Alert</h1><p class="max-w-2xl text-sm leading-6 text-muted-foreground">用于展示有明确语义的状态提示。</p></header>
        <Card title="Primitive" description="基础结构、图标、标题、描述和操作区。"><div class="grid gap-space-md"><For each={variants}>{(variant) => <Alert variant={variant}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width={2} stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg><AlertTitle>{variant}</AlertTitle><AlertDescription>当前任务已进入 {variant} 状态，请按页面操作继续处理。</AlertDescription><AlertAction><Badge variant="outline">New</Badge></AlertAction></Alert>}</For></div></Card>
      </div>
    </main>
  )
}
