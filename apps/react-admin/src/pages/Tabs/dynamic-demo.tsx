import { TabsContent, TabsItem, TabsList, TabsRoot } from '@fex/components-react/primitive/tabs'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'
import { createTab, initialTabs } from './data'

export function DynamicTabsDemo() {
  const [items, setItems] = useState(initialTabs)
  const [value, setValue] = useState('overview')
  const [nextIndex, setNextIndex] = useState(4)
  function add() { const item = createTab(nextIndex); setNextIndex(nextIndex + 1); setItems([...items, item]); setValue(item.value) }
  function remove(target: string) { const index = items.findIndex((item) => item.value === target); const next = items.filter((item) => item.value !== target); setItems(next); if (value === target) setValue(next[Math.min(index, next.length - 1)]?.value ?? '') }
  return <Card title="Add, remove and extra" description="Application data drives primitive Items and Contents while extra actions stay outside the List."><TabsRoot value={value} onChange={(next) => setValue(next ?? '')} onClose={(item) => remove(item.value)}><div className="flex min-w-0 items-center gap-space-sm"><span className="text-xs text-muted-foreground">Workspace</span><TabsList className="min-w-0 flex-1">{items.map((item) => <TabsItem key={item.value} value={item.value} {...(item.closable === undefined ? {} : { closable: item.closable })}>{item.label}</TabsItem>)}</TabsList><button type="button" className="rounded-md border border-border px-2 py-1 text-xs" onClick={add}>Add</button></div>{items.map((item) => <TabsContent key={item.value} value={item.value}>{item.content}</TabsContent>)}</TabsRoot></Card>
}
