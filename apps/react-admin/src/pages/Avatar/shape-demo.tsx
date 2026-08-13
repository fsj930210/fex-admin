import { Avatar, AvatarFallback } from '@fex-design/react/primitive/avatar'
import { Card } from '@fex-design/react/ui/card'

export function ShapeDemo() {
  return (
    <Card title="Shape" description="Avatar supports circle and square shapes.">
      <div className="flex items-center gap-space-lg">
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
