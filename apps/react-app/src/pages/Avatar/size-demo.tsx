import { Avatar, AvatarFallback } from '@fex-design/react/primitive/avatar'
import { Card } from '@fex-design/react/ui/card'

export function SizeDemo() {
  return (
    <Card title="Size" description="Avatar provides small, medium and large sizes.">
      <div className="flex items-center gap-space-lg">
        <Avatar size="sm">
          <AvatarFallback>SM</AvatarFallback>
        </Avatar>
        <Avatar size="md">
          <AvatarFallback>MD</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>LG</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  )
}
