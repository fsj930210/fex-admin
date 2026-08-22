import type { MasonryLayoutDetail, MasonryPlacement } from '@fex-design/react/primitive/masonry'
import { MasonryItem, MasonryRoot, MasonryViewport } from '@fex-design/react/primitive/masonry'
import { useState } from 'react'
import { masonryItems } from './data'

const items = masonryItems.slice(0, 9)
function StrategyExample({ placement }: { placement: MasonryPlacement }) {
  const [columns, setColumns] = useState<Record<string, number>>({})
  const handleLayout = (layout: MasonryLayoutDetail) => setColumns(Object.fromEntries(layout.items.map(item => [String(item.key), item.column + 1])))
  return <section className="grid gap-space-sm"><div><h3 className="font-medium">{placement === 'ordered' ? '按输入顺序（ordered）' : '按当前最短列（shortest）'}</h3><p className="text-sm text-muted-foreground">{placement === 'ordered' ? '按第 1、2、3 列循环分配，视觉读取顺序更稳定。' : '每次进入累计高度最小的列，列高更均衡。'}</p></div><MasonryRoot columns={3} gap={12} placement={placement} onLayoutChange={handleLayout}><MasonryViewport>{items.map((item, index) => <MasonryItem key={item.id} itemKey={item.id} index={index}><div className="rounded-md border border-border bg-muted-background p-space-sm" style={{ height: item.height / 2 }}><strong>Card {index + 1}</strong><p className="mt-1 text-xs text-muted-foreground">输入序号 {index + 1} · 最终第 {columns[item.id] ?? '…'} 列</p></div></MasonryItem>)}</MasonryViewport></MasonryRoot></section>
}
function PinnedExample() {
  return <section className="grid gap-space-sm"><div><h3 className="font-medium">指定列与自动分配混排</h3><p className="text-sm text-muted-foreground">Card 2 固定第 3 列；其他项目仍按最短列分配。列数不足时固定列会自动收敛到有效范围。</p></div><MasonryRoot columns={{ minColumnWidth: 160, max: 3 }} gap={{ column: 12, row: 20 }}><MasonryViewport>{items.slice(0, 6).map((item, index) => <MasonryItem key={item.id} itemKey={item.id} index={index} column={index === 1 ? 2 : undefined}><div className="rounded-md border border-border bg-muted-background p-space-sm" style={{ height: item.height / 2 }}><strong>Card {index + 1}</strong><p className="text-xs text-muted-foreground">{index === 1 ? '固定第 3 列' : '自动最短列'}</p></div></MasonryItem>)}</MasonryViewport></MasonryRoot></section>
}
export function StrategyMasonryDemo() { return <div className="grid gap-space-xl"><StrategyExample placement="ordered" /><StrategyExample placement="shortest" /><PinnedExample /></div> }
