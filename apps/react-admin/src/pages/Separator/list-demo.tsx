import { Separator } from '@fex-design/react/primitive/separator'
import { Card } from '@fex-design/react/ui/card'
const items = [
  ['Workspace', 'Fex Admin'],
  ['Plan', 'Team'],
  ['Region', 'Asia Pacific'],
]
export const ListDemo = () => (
  <Card title="List" description="Place separators between rows, not after the final item.">
    <div className="grid max-w-lg">
      {items.map(([label, value], index) => (
        <div key={label}>
          <div className="flex justify-between py-space-md">
            <span>{label}</span>
            <span className="text-muted-foreground">{value}</span>
          </div>
          {index < items.length - 1 && <Separator />}
        </div>
      ))}
    </div>
  </Card>
)
