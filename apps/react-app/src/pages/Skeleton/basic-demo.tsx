import { Skeleton } from '@fex-design/react/primitive/skeleton'
import { Card } from '@fex-design/react/ui/card'
export function BasicDemo() {
  return (
    <Card title="Basic" description="A single placeholder with a custom size.">
      <Skeleton className="h-5 max-w-sm" />
    </Card>
  )
}
