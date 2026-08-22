import type { MasonryLayoutDetail } from '@fex-design/react/primitive/masonry'
import { MasonryItem, MasonryRoot, MasonryViewport } from '@fex-design/react/primitive/masonry'
import { useState } from 'react'
import { masonryItems } from './data'

export function BasicMasonryDemo() {
  const [columns, setColumns] = useState<Record<string, number>>({})
  const handleLayout = (layout: MasonryLayoutDetail) => setColumns(Object.fromEntries(layout.items.map(item => [String(item.key), item.column + 1])))
  return <MasonryRoot columns={3} gap={16} onLayoutChange={handleLayout}><MasonryViewport>{masonryItems.slice(0, 9).map((item, index) => <MasonryItem key={item.id} itemKey={item.id} index={index}><article className="rounded-md border border-border bg-background p-space-md" style={{ minHeight: item.height / 2 }}><strong>{item.title}</strong><p className="mt-2 text-xs text-muted-foreground">输入序号 {index + 1} · key {item.id} · 最终第 {columns[item.id] ?? '…'} 列</p></article></MasonryItem>)}</MasonryViewport></MasonryRoot>
}
