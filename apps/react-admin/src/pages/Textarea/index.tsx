import { Textarea } from '@fex/components-react/primitive/textarea'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

export function TextareaPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold text-foreground">Textarea</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">基础多行输入控件，覆盖普通、禁用和校验态。</p>
        </header>

        <Card title="States" description="常用多行输入状态。">
          <div className="grid gap-space-lg">
            <Textarea placeholder="记录本次处理说明" />
            <Textarea defaultValue="只读多行内容" disabled />
            <Textarea aria-invalid placeholder="校验失败" />
          </div>
        </Card>
      </div>
    </main>
  )
}
