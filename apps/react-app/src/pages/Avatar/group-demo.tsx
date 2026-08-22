import { Avatar, AvatarFallback, AvatarGroup } from '@fex-design/react/primitive/avatar'
import { Card } from '@fex-design/react/ui/card'

export function GroupDemo() {
  return (
    <Card title="Avatar group" description="Keep the first avatars visible and summarize the rest.">
      <AvatarGroup maxCount={3}>
        {['AM', 'BL', 'CS', 'DT', 'ER'].map((name) => <Avatar key={name}><AvatarFallback>{name}</AvatarFallback></Avatar>)}
      </AvatarGroup>
    </Card>
  )
}
