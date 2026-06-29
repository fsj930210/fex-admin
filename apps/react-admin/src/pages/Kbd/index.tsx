import { Kbd, KbdGroup } from '@fex/components-react/primitive/kbd'
import { Card } from '@fex/components-react/ui/card'
import { Link } from 'react-router'

export function KbdPage() {
  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-md">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">返回首页</Link>
          <h1 className="text-2xl font-semibold text-foreground">Kbd</h1>
          <p className="max-w-2xl text-sm leading-6 text-muted-foreground">用于展示键盘按键和快捷键组合。</p>
        </header>

        <Card title="Shortcuts" description="单个按键和组合按键。">
          <div className="flex min-w-0 flex-wrap items-center gap-space-lg">
            <Kbd>Esc</Kbd>
            <KbdGroup><Kbd>Ctrl</Kbd><Kbd>K</Kbd></KbdGroup>
            <KbdGroup><Kbd>⌘</Kbd><Kbd>Enter</Kbd></KbdGroup>
          </div>
        </Card>
      </div>
    </main>
  )
}
