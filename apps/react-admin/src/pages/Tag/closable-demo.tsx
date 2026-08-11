import { Tag } from '@fex-design/react/primitive/tag'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

export function ClosableDemo() {
  const [items, setItems] = useState(['React', 'Vue', 'Solid'])
  return <Card title="可关闭" description="closable 只展示关闭按钮，外部通过 onClose 决定是否移除。"><div className="flex flex-wrap items-center gap-space-md">{items.map((item) => <Tag key={item} closable onClose={() => setItems((current) => current.filter((value) => value !== item))}>{item}</Tag>)}<Tag closable>无回调</Tag><Tag closable disabled>禁用</Tag></div></Card>
}
