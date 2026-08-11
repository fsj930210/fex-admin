import { Tag } from '@fex-design/solid/primitive/tag'
import { Card } from '@fex-design/solid/ui/card'
import { createSignal, For } from 'solid-js'
export function ClosableDemo(){const[items,setItems]=createSignal(['React','Vue','Solid']);return <Card title="可关闭" description="closable 只展示关闭按钮，外部通过 onClose 决定是否移除。"><div class="flex flex-wrap items-center gap-space-md"><For each={items()}>{item=><Tag closable onClose={()=>setItems(current=>current.filter(value=>value!==item))}>{item}</Tag>}</For><Tag closable>无回调</Tag><Tag closable disabled>禁用</Tag></div></Card>}
