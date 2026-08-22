import { Tag } from '@fex-design/solid/primitive/tag'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
const presets=['neutral','primary','success','warning','danger'] as const
export function ColorDemo(){return <Card title="颜色" description="内置名称选择可覆盖变量，color 也接受任意 CSS 颜色。"><div class="flex flex-wrap items-center gap-space-md"><For each={presets}>{color=><Tag color={color}>{color}</Tag>}</For><Tag color="#7c3aed">#7c3aed</Tag><Tag color="oklch(0.7 0.18 190)">OKLCH</Tag></div></Card>}
