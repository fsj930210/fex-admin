import { Spinner } from '@fex/components-react/primitive/spinner'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

const sizes = ['sm', 'md', 'lg'] as const

export function SpinnerPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold text-foreground">Spinner</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">用于局部加载反馈。</p>
        </header>

        <Card title="Sizes" description="覆盖全部公开 size。">
          <div className="flex min-w-0 flex-wrap items-center gap-space-lg">
            {sizes.map((size) => <Spinner key={size} size={size} aria-label={`${size} loading`} />)}
          </div>
        </Card>
      </div>
    </main>
  )
}
