import { Input } from '@fex/components-solid/primitive/input'
import { Card } from '@fex/components-solid/ui/card'
import { A } from '@solidjs/router'

export function InputPage() {
  return (
    <main class="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div class="mx-auto w-full max-w-5xl space-y-space-xl">
        <header class="space-y-space-md">
          <A class="text-sm text-muted-foreground hover:text-foreground" href="/">
            返回首页
          </A>
          <h1 class="text-2xl font-semibold text-foreground">Input</h1>
          <p class="max-w-2xl text-sm leading-6 text-muted-foreground">
            基础单行输入控件，覆盖原生受控、非受控、禁用和校验态。
          </p>
        </header>
        <Card title="States" description="常用输入状态。">
          <div class="grid gap-space-lg md:grid-cols-2">
            <Input placeholder="admin@example.com" type="email" />
            <Input value="只读内容" disabled />
            <Input aria-invalid placeholder="校验失败" />
            <Input type="file" />
          </div>
        </Card>
      </div>
    </main>
  )
}
