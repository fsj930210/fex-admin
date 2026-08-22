import { MasonryItem, MasonryRoot, MasonryViewport } from '@fex-design/react/primitive/masonry'
import { Button } from '@fex-design/react/ui/button'
import { useState } from 'react'
import { masonryItems } from './data'

const summaries = ['待确认需求范围', '正在整理交互状态', '已完成视觉走查', '等待接口数据', '正在补充异常分支', '已进入回归验证', '准备发布说明', '等待最终确认']
const details = ['补充响应式宽度变化后的验收结果。', '记录图片加载完成后的重新测量过程。', '确认动态内容不会覆盖相邻项目。']

export function DynamicMasonryDemo() {
  const [target, setTarget] = useState(0)
  const [detailCount, setDetailCount] = useState(0)
  const items = masonryItems.slice(0, 8)
  const switchTarget = () => { setTarget(value => (value + 1) % items.length); setDetailCount(0) }

  return <div className="grid gap-space-md"><div className="flex flex-wrap items-center gap-space-sm rounded-md border border-border bg-muted-background p-space-sm"><span className="mr-auto text-sm">当前观察：<strong>Card {target + 1}</strong> · 新增 {detailCount} 段</span><Button size="sm" variant="outline" onClick={switchTarget}>切换目标</Button><Button size="sm" onClick={() => setDetailCount(value => Math.min(details.length, value + 1))}>追加内容</Button><Button size="sm" variant="outline" disabled={!detailCount} onClick={() => setDetailCount(value => Math.max(0, value - 1))}>收起内容</Button><Button size="sm" variant="outline" onClick={() => setDetailCount(details.length)}>连续更新</Button><Button size="sm" variant="ghost" onClick={() => setDetailCount(0)}>重置</Button></div><MasonryRoot columns={{ minColumnWidth: 220, max: 4 }} gap={16}><MasonryViewport>{items.map((item, index) => { const active = index === target; return <MasonryItem key={item.id} itemKey={item.id} index={index}><article className={`grid gap-space-sm rounded-md border p-space-md ${active ? 'border-primary bg-primary/5' : 'border-border bg-background'}`}><div className="flex items-center justify-between gap-space-sm"><strong>{item.title}</strong><span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">{active ? '观察中' : `第 ${index + 1} 项`}</span></div><p className="text-sm text-muted-foreground">{summaries[index]}</p>{active && details.slice(0, detailCount).map(detail => <p key={detail} className="border-t border-border pt-space-sm text-sm">{detail}</p>)}</article></MasonryItem> })}</MasonryViewport></MasonryRoot></div>
}
