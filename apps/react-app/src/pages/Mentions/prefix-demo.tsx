import { MentionsContent } from '@fex-design/react/primitive/mentions/content'
import { MentionsItem } from '@fex-design/react/primitive/mentions/item'
import { MentionsList } from '@fex-design/react/primitive/mentions/list'
import { MentionsPrefixCase } from '@fex-design/react/primitive/mentions/prefix-case'
import { MentionsRoot } from '@fex-design/react/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/react/primitive/mentions/trigger'
import { useMentions } from '@fex-design/react/primitive/mentions/use-mentions'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { filterByText, mentionCommands, mentionDocs, mentionUsers } from './data'

function UserItems() {
  const mentions = useMentions()
  return (
    <MentionsList>
      {filterByText(mentionUsers, mentions.text, (user) => user.name).map((user) => (
        <MentionsItem key={user.id} itemKey={user.id} value={user.name} data={user}>
          @{user.name}
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

function DocItems() {
  const mentions = useMentions()
  return (
    <MentionsList>
      {filterByText(mentionDocs, mentions.text, (doc) => doc.title).map((doc) => (
        <MentionsItem key={doc.id} itemKey={doc.id} value={doc.title} data={doc}>
          #{doc.title}
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

function CommandItems() {
  const mentions = useMentions()
  return (
    <MentionsList>
      {filterByText(mentionCommands, mentions.text, (command) => command.label).map((command) => (
        <MentionsItem key={command.id} itemKey={command.id} value={command.id} data={command}>
          /{command.label}
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

export function PrefixDemo() {
  const [value, setValue] = useState('')
  const [selected, setSelected] = useState('Type @, #, or /')
  return (
    <Card title="Trigger characters" description="Different prefixes render different item sets.">
      <MentionsRoot
        prefix={['@', '#', '/']}
        value={value}
        onChange={setValue}
        onSelect={(item, meta) => setSelected(meta.prefix + ' -> ' + item.value)}
      >
        <MentionsTrigger placeholder="Try @Ada, #Pricing, or /summarize" autoSize={{ minRows: 2 }} />
        <MentionsContent>
          <MentionsPrefixCase prefix="@">
            <UserItems />
          </MentionsPrefixCase>
          <MentionsPrefixCase prefix="#">
            <DocItems />
          </MentionsPrefixCase>
          <MentionsPrefixCase prefix="/">
            <CommandItems />
          </MentionsPrefixCase>
        </MentionsContent>
      </MentionsRoot>
      <p className="mt-space-sm text-xs text-muted-foreground">{selected}</p>
    </Card>
  )
}
