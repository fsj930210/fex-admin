import { Avatar, AvatarFallback, AvatarGroup } from '@fex-design/solid/primitive/avatar'
import { Card } from '@fex-design/solid/ui/card'
import { For } from 'solid-js'
export function GroupDemo() {
  return <Card title="Avatar group" description="Keep the first avatars visible and summarize the rest."><AvatarGroup maxCount={3}><For each={['AM', 'BL', 'CS', 'DT', 'ER']}>{(name) => <Avatar><AvatarFallback>{name}</AvatarFallback></Avatar>}</For></AvatarGroup></Card>
}
