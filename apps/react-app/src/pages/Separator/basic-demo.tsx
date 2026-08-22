import { Separator } from '@fex-design/react/primitive/separator'
import { Card } from '@fex-design/react/ui/card'
export const BasicDemo = () => (
  <Card title="Basic" description="Separate related sections with a semantic horizontal rule.">
    <div className="grid max-w-xl gap-space-md">
      <div>
        <div className="font-medium">Fex Design</div>
        <div className="text-sm text-muted-foreground">
          Composable components for five frameworks.
        </div>
      </div>
      <Separator decorative={false} />
      <div className="text-sm">React · Vue · Solid · Svelte · Angular</div>
    </div>
  </Card>
)
