import { Anchor, type AnchorItem } from '@fex-design/solid/primitive/anchor'
import { Card } from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'

const items: AnchorItem<string>[] = [
  { key: 'anchor-overview', title: 'Overview', target: '#anchor-overview' },
  { key: 'anchor-api', title: 'API', target: '#anchor-api', children: [{ key: 'anchor-props', title: 'Props', target: '#anchor-props' }] },
  { key: 'anchor-examples', title: 'Examples', target: '#anchor-examples' },
]
export function AnchorDemo() {
  let container: HTMLDivElement | undefined
  const [activeKeys, setActiveKeys] = createSignal<readonly string[]>([])
  const [currentKeys, setCurrentKeys] = createSignal<readonly string[]>([])
  return <Card title="Current and progress" description="Progress mode keeps all anchors passed so far active.">
    <div class="grid gap-space-lg lg:grid-cols-[10rem_10rem_1fr]">
      <div><p class="mb-space-sm text-xs font-medium text-muted-foreground">Current</p><Anchor items={items} activeKeys={currentKeys()} activeOffset={80} container={() => container ?? window} onChange={setCurrentKeys} /></div>
      <div><p class="mb-space-sm text-xs font-medium text-muted-foreground">Progress</p><Anchor items={items} activeMode="progress" activeKeys={activeKeys()} activeOffset={80} container={() => container ?? window} onChange={setActiveKeys} /></div>
      <div ref={container} class="h-72 overflow-y-auto rounded-md border border-border p-space-lg">
        <section id="anchor-overview" class="min-h-48"><h3 class="font-medium">Overview</h3><p class="mt-2 text-sm text-muted-foreground">Anchor tracks content inside any scroll container.</p></section>
        <section id="anchor-api" class="min-h-48"><h3 class="font-medium">API</h3><p class="mt-2 text-sm text-muted-foreground">Progress mode keeps previously passed anchors active.</p></section>
        <section id="anchor-props" class="min-h-48"><h3 class="font-medium">Props</h3><p class="mt-2 text-sm text-muted-foreground">Nested headings preserve their real hierarchy.</p></section>
        <section id="anchor-examples" class="min-h-48"><h3 class="font-medium">Examples</h3><p class="mt-2 text-sm text-muted-foreground">Click an item or scroll this panel.</p></section>
      </div>
    </div><p class="mt-space-md text-xs text-muted-foreground">current: {currentKeys().join(', ') || 'none'} · progress: {activeKeys().join(', ') || 'none'}</p>
  </Card>
}
