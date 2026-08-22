import { Avatar, AvatarFallback } from '@fex-design/solid/primitive/avatar'
import { Card } from '@fex-design/solid/ui/card'
export function ShapeDemo() {
  return (
    <Card title="Shape" description="Avatar supports circle and square shapes.">
      <div class="flex items-center gap-space-lg">
        <Avatar shape="circle">
          <AvatarFallback>CI</AvatarFallback>
        </Avatar>
        <Avatar shape="square">
          <AvatarFallback>SQ</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  )
}
