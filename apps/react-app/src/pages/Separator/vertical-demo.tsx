import { Separator } from '@fex-design/react/primitive/separator'
import { Card } from '@fex-design/react/ui/card'
export const VerticalDemo = () => (
  <Card title="Vertical" description="Use vertical separators between compact inline items.">
    <div className="flex h-5 items-center gap-space-md">
      <span>Blog</span>
      <Separator orientation="vertical" />
      <span>Docs</span>
      <Separator orientation="vertical" />
      <span>Source</span>
    </div>
  </Card>
)
