import { Toggle, ToggleGroup } from '@fex-design/react/primitive/toggle'
import { Card } from '@fex-design/react/ui/card'
import { useState, type ReactNode } from 'react'
import { Link } from 'react-router'

function FormatToggle({ value, mark, children }: { value: string; mark: ReactNode; children: ReactNode }) {
  return <Toggle value={value}><span aria-hidden>{mark}</span>{children}</Toggle>
}

export function TogglePage() {
  const [pressed, setPressed] = useState(false)
  const [alignment, setAlignment] = useState('left')
  const [formats, setFormats] = useState<string[]>(['bold'])

  return (
    <main className="min-h-screen bg-secondary-background px-page-padding py-space-xl">
      <div className="mx-auto w-full max-w-5xl space-y-space-xl">
        <header className="space-y-space-xl">
          <Link className="text-sm text-muted-foreground hover:text-foreground" to="/">Back home</Link>
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Toggle</h1>
            <p className="mt-space-md text-sm text-muted-foreground">Two-state controls for independent actions and related option groups.</p>
          </div>
        </header>

        <div className="grid gap-space-xl">
          <Card title="Standalone" description="A single Toggle exposes a clear pressed state without needing a group.">
            <div className="grid justify-items-start gap-space-md">
              <Toggle pressed={pressed} onChange={setPressed}><span aria-hidden>★</span>Favorite</Toggle>
              <p className="text-sm text-muted-foreground">{pressed ? 'Added to favorites' : 'Not in favorites'}</p>
            </div>
          </Card>

          <Card title="Single selection" description="The group reads as one segmented control while keeping each option independently focusable.">
            <div className="grid gap-space-md">
              <ToggleGroup value={alignment} onChange={setAlignment} aria-label="Text alignment">
                <Toggle value="left">Left</Toggle><Toggle value="center">Center</Toggle><Toggle value="right">Right</Toggle>
              </ToggleGroup>
              <p className="text-sm text-muted-foreground">Alignment: {alignment || 'none'}</p>
            </div>
          </Card>

          <Card title="Multiple selection" description="Multiple mode keeps related formatting controls inside one visual surface.">
            <div className="grid gap-space-md">
              <ToggleGroup multiple value={formats} onChange={setFormats} aria-label="Text formatting">
                <FormatToggle value="bold" mark={<strong>B</strong>}>Bold</FormatToggle>
                <FormatToggle value="italic" mark={<em>I</em>}>Italic</FormatToggle>
                <FormatToggle value="underline" mark={<u>U</u>}>Underline</FormatToggle>
              </ToggleGroup>
              <p className="text-sm text-muted-foreground">Active: {formats.join(', ') || 'none'}</p>
            </div>
          </Card>

          <Card title="Variants and layout" description="Groups keep one visual identity across compact, outline, vertical, and disabled states.">
            <div className="grid gap-space-lg">
              <div className="flex items-center gap-space-lg"><span className="w-20 text-sm text-muted-foreground">Compact</span><ToggleGroup defaultValue="day" size="sm"><Toggle value="day">Day</Toggle><Toggle value="week">Week</Toggle><Toggle value="month">Month</Toggle></ToggleGroup></div>
              <div className="flex items-start gap-space-lg"><span className="w-20 pt-1.5 text-sm text-muted-foreground">Vertical</span><ToggleGroup defaultValue="top" orientation="vertical" variant="outline"><Toggle value="top">Top</Toggle><Toggle value="center">Center</Toggle><Toggle value="bottom">Bottom</Toggle></ToggleGroup></div>
              <div className="flex items-center gap-space-lg"><span className="w-20 text-sm text-muted-foreground">Disabled</span><ToggleGroup defaultValue="one" disabled><Toggle value="one">One</Toggle><Toggle value="two">Two</Toggle></ToggleGroup></div>
            </div>
          </Card>
        </div>
      </div>
    </main>
  )
}
