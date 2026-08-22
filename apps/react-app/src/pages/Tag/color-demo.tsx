import { Tag } from '@fex-design/react/primitive/tag'
import { Card } from '@fex-design/react/ui/card'

const presets = ['neutral', 'primary', 'success', 'warning', 'danger'] as const
export function ColorDemo() {
  return <Card title="颜色" description="内置名称选择可覆盖变量，color 也接受任意 CSS 颜色。"><div className="flex flex-wrap items-center gap-space-md">{presets.map((color) => <Tag key={color} color={color}>{color}</Tag>)}<Tag color="#7c3aed">#7c3aed</Tag><Tag color="oklch(0.7 0.18 190)">OKLCH</Tag></div></Card>
}
