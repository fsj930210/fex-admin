import { Tag } from '@fex-design/solid/primitive/tag'
import { Card } from '@fex-design/solid/ui/card'
export function BasicDemo(){return <Card title="基础与外观" description="Tag 可以独立展示，颜色和外观彼此独立。"><div class="flex flex-wrap items-center gap-space-md"><Tag>默认标签</Tag><Tag variant="outlined">描边标签</Tag><Tag variant="solid" color="primary">强调标签</Tag><Tag size="sm">紧凑标签</Tag></div></Card>}
