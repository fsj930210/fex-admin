import { Anchor, type AnchorItem } from '@fex-design/react/primitive/anchor'
import { Card } from '@fex-design/react/ui/card'
import { useRef, useState } from 'react'

const items: AnchorItem[] = [
  { key: 'anchor-overview', title: 'Overview', target: '#anchor-overview' },
  { key: 'anchor-api', title: 'API', target: '#anchor-api', children: [{ key: 'anchor-props', title: 'Props', target: '#anchor-props' }] },
  { key: 'anchor-examples', title: 'Examples', target: '#anchor-examples' },
]

export function AnchorDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeKeys, setActiveKeys] = useState<readonly string[]>([])
  const [currentKeys, setCurrentKeys] = useState<readonly string[]>([])
  return (
    <Card title="Current and progress" description="Switch between a single current anchor and all anchors passed so far.">
      <div className="grid gap-space-lg lg:grid-cols-[10rem_10rem_1fr]">
        <div><p className="mb-space-sm text-xs font-medium text-muted-foreground">Current</p><Anchor items={items} activeKeys={currentKeys} activeOffset={80} container={() => containerRef.current ?? window} onChange={setCurrentKeys} /></div>
        <div><p className="mb-space-sm text-xs font-medium text-muted-foreground">Progress</p>
        <Anchor
          items={items}
          activeMode="progress"
          activeOffset={80}
          activeKeys={activeKeys}
          container={() => containerRef.current ?? window}
          onChange={setActiveKeys}
        />
        </div>
        <div ref={containerRef} className="h-72 overflow-y-auto rounded-md border border-border p-space-lg">
          <section id="anchor-overview" className="min-h-48"><h3 className="font-medium">Overview</h3><p className="mt-2 text-sm text-muted-foreground">Anchor tracks content inside any scroll container.</p></section>
          <section id="anchor-api" className="min-h-48"><h3 className="font-medium">API</h3><p className="mt-2 text-sm text-muted-foreground">Progress mode keeps previously passed anchors active.</p></section>
          <section id="anchor-props" className="min-h-48"><h3 className="font-medium">Props</h3><p className="mt-2 text-sm text-muted-foreground">Nested headings preserve their real hierarchy.</p></section>
          <section id="anchor-examples" className="min-h-48"><h3 className="font-medium">Examples</h3><p className="mt-2 text-sm text-muted-foreground">Click an item or scroll this panel.</p></section>
        </div>
      </div>
      <p className="mt-space-md text-xs text-muted-foreground">current: {currentKeys.join(', ') || 'none'} · progress: {activeKeys.join(', ') || 'none'}</p>
    </Card>
  )
}
