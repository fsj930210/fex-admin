import { Input } from '@fex/components-react/primitive/input'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

export function InputPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold text-foreground">Input</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">基础单行输入控件，覆盖原生受控、非受控、禁用和校验态。</p>
        </header>

        <Card title="States" description="常用输入状态。">
          <div className="grid gap-space-lg md:grid-cols-2">
            <Input placeholder="admin@example.com" type="email" />
            <Input defaultValue="只读内容" disabled />
            <Input aria-invalid placeholder="校验失败" />
            <Input type="file" />
          </div>
        </Card>
      </div>
    </main>
  )
}
