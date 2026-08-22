import { MasonryItem, MasonryRoot, MasonryViewport } from '@fex-design/react/primitive/masonry'
import { Button } from '@fex-design/react/ui/button'
import { useState } from 'react'
import { masonryItems } from './data'

export function RtlHiddenMasonryDemo() {
  const [rtl, setRtl] = useState(false); const [visible, setVisible] = useState(true)
  return <div className="grid gap-space-md"><div className="flex gap-space-sm"><Button size="sm" variant="outline" onClick={() => setRtl(value => !value)}>方向：{rtl ? 'RTL' : 'LTR'}</Button><Button size="sm" variant="outline" onClick={() => setVisible(value => !value)}>{visible ? '隐藏' : '显示'}容器</Button></div><div className={visible ? 'block' : 'hidden'}><MasonryRoot columns={3} gap={12} direction={rtl ? 'rtl' : 'ltr'}><MasonryViewport>{masonryItems.slice(0, 8).map((item, index) => <MasonryItem key={item.id} itemKey={item.id} index={index}><div className="rounded-md border border-border bg-muted-background p-space-sm" style={{ height: item.height / 2 }}>DOM {index + 1} · {rtl ? 'RTL' : 'LTR'}</div></MasonryItem>)}</MasonryViewport></MasonryRoot></div></div>
}
