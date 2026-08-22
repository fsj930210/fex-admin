import { MasonryItem, MasonryRoot, MasonryViewport } from '@fex-design/react/primitive/masonry'
import { Button } from '@fex-design/react/ui/button'
import { useState } from 'react'
import { masonryItems, type MasonryDemoItem } from './data'

const initial = masonryItems.slice(0, 8)
export function CollectionMasonryDemo() {
  const [items, setItems] = useState(initial)
  const [serial, setSerial] = useState(1)
  const add = (middle = false) => { const item: MasonryDemoItem = { id: `added-${serial}`, title: `新增 ${serial}`, height: 120 + serial % 3 * 40 }; setSerial(value => value + 1); setItems(value => { const next = [...value]; next.splice(middle ? Math.floor(next.length / 2) : next.length, 0, item); return next }) }
  return <div className="grid gap-space-md"><div className="flex flex-wrap gap-space-sm"><Button size="sm" onClick={() => add()}>末尾添加</Button><Button size="sm" variant="outline" onClick={() => add(true)}>中间插入</Button><Button size="sm" variant="outline" onClick={() => setItems(value => [...value].sort(() => Math.random() - 0.5))}>打乱</Button><Button size="sm" variant="outline" onClick={() => setItems(initial)}>恢复</Button></div><MasonryRoot columns={3} gap={12}><MasonryViewport>{items.map((item, index) => <MasonryItem key={item.id} itemKey={item.id} index={index}><article className="rounded-md border border-border bg-background p-space-md" style={{ minHeight: item.height / 2 }}><strong>{item.title}</strong><p className="text-xs text-muted-foreground">{item.id}</p><Button className="mt-2" size="sm" variant="outline" onClick={() => setItems(value => value.filter(current => current.id !== item.id))}>删除</Button></article></MasonryItem>)}</MasonryViewport></MasonryRoot></div>
}
