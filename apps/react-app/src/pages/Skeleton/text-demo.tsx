import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { Card } from '@fex-design/react/ui/card'
export function TextDemo() {
  return (
    <Card title="Text" description="Use varied widths to suggest paragraph rhythm.">
      <div className="grid max-w-xl gap-space-sm">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </Card>
  )
}
