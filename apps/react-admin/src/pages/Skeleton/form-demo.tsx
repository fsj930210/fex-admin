import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { Card } from '@fex-design/react/ui/card'
export function FormDemo() {
  return (
    <Card title="Form" description="Match labels, controls and actions.">
      <div className="grid max-w-md gap-space-lg">
        <div className="grid gap-space-sm">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="grid gap-space-sm">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-9 w-full" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
    </Card>
  )
}
