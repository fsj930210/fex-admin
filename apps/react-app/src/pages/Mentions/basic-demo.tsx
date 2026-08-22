import { MentionsContent } from '@fex-design/react/primitive/mentions/content'
import { MentionsItem } from '@fex-design/react/primitive/mentions/item'
import { MentionsList } from '@fex-design/react/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/react/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/react/primitive/mentions/trigger'
import { useMentions } from '@fex-design/react/primitive/mentions/use-mentions'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { filterByText, mentionUsers } from './data'

function UserItems() {
  const mentions = useMentions()
  const users = filterByText(mentionUsers, mentions.text, (user) => user.name)
  return (
    <MentionsList>
      {users.map((user) => (
        <MentionsItem key={user.id} itemKey={user.id} value={user.name} data={user}>
          <span className="flex min-w-0 flex-col">
            <span className="truncate font-medium">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.role}</span>
          </span>
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

export function BasicDemo() {
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState('No mention selected')
  return (
    <Card title="Basic @" description="Default prefix is @ and selection only notifies the caller.">
      <MentionsRoot
        value={value}
        onChange={setValue}
        onSelect={(item) => setSelected('Selected ' + item.value)}
      >
        <MentionsTrigger placeholder="Type @ to mention a teammate" autoSize={{ minRows: 2 }} />
        <MentionsContent>
          <UserItems />
        </MentionsContent>
      </MentionsRoot>
      <p className="mt-space-sm text-xs text-muted-foreground">{selected}</p>
    </Card>
  )
}
