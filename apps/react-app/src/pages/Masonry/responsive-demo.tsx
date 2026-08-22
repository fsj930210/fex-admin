import { MasonryItem, MasonryRoot, MasonryViewport, type MasonryColumns, type MasonryLayoutDetail } from '@fex-design/react/primitive/masonry'
import { useState } from 'react'
import { masonryItems } from './data'

function Example({ title, columns }: { title: string; columns: MasonryColumns }) {
  const [width, setWidth] = useState(720); const [count, setCount] = useState(0)
  return <section className="grid gap-space-sm"><div><h3 className="font-medium">{title}</h3><p className="text-sm text-muted-foreground">容器 {width}px · 当前 {count || '…'} 列</p></div><input aria-label={`${title}容器宽度`} type="range" min="280" max="960" value={width} onChange={event => setWidth(Number(event.target.value))} /><div className="max-w-full overflow-hidden" style={{ width }}><MasonryRoot columns={columns} gap={12} onLayoutChange={(layout: MasonryLayoutDetail) => setCount(layout.columnCount)}><MasonryViewport>{masonryItems.slice(0, 6).map((item, index) => <MasonryItem key={item.id} itemKey={item.id} index={index}><div className="rounded-md border border-border bg-muted-background p-space-sm" style={{ height: item.height / 3 }}>Card {index + 1}</div></MasonryItem>)}</MasonryViewport></MasonryRoot></div></section>
}
export function ResponsiveMasonryDemo() { return <div className="grid gap-space-xl"><Example title="最小列宽" columns={{ minColumnWidth: 180, max: 5 }} /><Example title="容器断点" columns={[{ minWidth: 0, columns: 1 }, { minWidth: 480, columns: 2 }, { minWidth: 700, columns: 3 }, { minWidth: 900, columns: 4 }]} /></div> }
