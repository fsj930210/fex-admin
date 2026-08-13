import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from '@fex-design/react/primitive/avatar'
import { Card } from '@fex-design/react/ui/card'

export function ContentDemo() {
  return (
    <Card title="Content" description="Use an image with fallback content and an optional badge.">
      <div className="flex items-center gap-space-lg">
        <Avatar size="lg">
          <AvatarImage src="/avatar-demo.svg" alt="Example avatar" />
          <AvatarFallback>IM</AvatarFallback>
          <AvatarBadge aria-label="Online" />
        </Avatar>
        <Avatar size="lg">
          <AvatarImage src="/missing-avatar.png" alt="Missing avatar" />
          <AvatarFallback>FX</AvatarFallback>
        </Avatar>
      </div>
    </Card>
  )
}
