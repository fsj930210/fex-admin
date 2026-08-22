import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { Card } from '@fex-design/react/ui/card'
export function AvatarDemo() {
  return (
    <Card title="Avatar" description="Compose circular and text placeholders.">
      <div className="flex max-w-md items-center gap-space-lg">
        <Skeleton className="size-12 rounded-full" />
        <div className="grid flex-1 gap-space-sm">
          <Skeleton className="h-4 w-2/5" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      </div>
    </Card>
  )
}
