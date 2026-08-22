import { Anchor } from '@fex-design/react/primitive/anchor'
import { Card } from '@fex-design/react/ui/card'
import { useRef } from 'react'

export function HorizontalDemo() {
  const containerRef = useRef<HTMLDivElement>(null)
  return <Card title="Horizontal" description="Horizontal anchors keep the same scroll-spy behavior without nested items.">
    <Anchor orientation="horizontal" activeOffset={80} container={() => containerRef.current ?? window} items={[
      { key: 'horizontal-one', title: 'Overview', target: '#horizontal-overview' },
      { key: 'horizontal-two', title: 'API', target: '#horizontal-api' },
      { key: 'horizontal-three', title: 'Examples', target: '#horizontal-examples' },
    ]} />
    <div ref={containerRef} className="mt-space-md h-40 overflow-y-auto rounded-md border border-border p-space-lg"><section id="horizontal-overview" className="min-h-32">Overview content</section><section id="horizontal-api" className="min-h-32">API content</section><section id="horizontal-examples" className="min-h-32">Examples content</section></div>
  </Card>
}
