import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { Card } from '@fex-design/react/ui/card'
const rows = ['w-2/5', 'w-3/5', 'w-1/2']
export function TableDemo() {
  return (
    <Card title="Table" description="Repeat stable row shapes for data loading.">
      <div className="grid max-w-2xl gap-space-md">
        <div className="grid grid-cols-3 gap-space-lg border-b pb-space-md">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        {rows.map((width, index) => (
          <div key={width} className="grid grid-cols-3 gap-space-lg">
            <div className="flex items-center gap-space-sm">
              <Skeleton className="size-8 rounded-full" />
              <Skeleton className={`h-4 ${width}`} />
            </div>
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </Card>
  )
}
