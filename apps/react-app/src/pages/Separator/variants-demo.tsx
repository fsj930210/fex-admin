import { Separator } from '@fex-design/react/primitive/separator'
import { Card } from '@fex-design/react/ui/card'
export const VariantsDemo = () => (
  <Card title="Variants" description="Use class composition for solid, dashed and dotted rules.">
    <div className="grid max-w-xl gap-space-lg">
      <div className="grid gap-space-sm">
        <span className="text-sm">Solid</span>
        <Separator />
      </div>
      <div className="grid gap-space-sm">
        <span className="text-sm">Dashed</span>
        <Separator className="h-0 border-t border-dashed bg-transparent" />
      </div>
      <div className="grid gap-space-sm">
        <span className="text-sm">Dotted</span>
        <Separator className="h-0 border-t border-dotted bg-transparent" />
      </div>
    </div>
  </Card>
)
