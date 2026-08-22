import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { Card } from '@fex-design/react/ui/card'
export function CardDemo() {
  return (
    <Card title="Card" description="Preserve a media card layout while loading.">
      <div className="grid max-w-sm gap-space-md">
        <Skeleton className="aspect-video w-full" />
        <Skeleton className="h-5 w-3/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-4/5" />
      </div>
    </Card>
  )
}
