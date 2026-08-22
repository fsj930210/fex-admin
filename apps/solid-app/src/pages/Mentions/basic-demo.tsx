import { MentionsContent } from '@fex-design/solid/primitive/mentions/content'
import { MentionsItem } from '@fex-design/solid/primitive/mentions/item'
import { MentionsList } from '@fex-design/solid/primitive/mentions/list'
import { MentionsRoot, useMentions } from '@fex-design/solid/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/solid/primitive/mentions/trigger'
import { Card } from '@fex-design/solid/ui/card'
import { For, createSignal } from 'solid-js'
import { filterByText, mentionUsers } from './data'

function UserItems() {
  const mentions = useMentions()
  const users = () => filterByText(mentionUsers, mentions.text(), (user) => user.name)
  return (
    <MentionsList>
      <For each={users()}>
        {(user) => (
          <MentionsItem itemKey={user.id} value={user.name} data={user}>
            <span class="flex min-w-0 flex-col">
              <span class="truncate font-medium">{user.name}</span>
              <span class="text-xs text-muted-foreground">{user.role}</span>
            </span>
          </MentionsItem>
        )}
      </For>
    </MentionsList>
  )
}

export function BasicDemo() {
  const [value, setValue] = createSignal('')
  const [selected, setSelected] = createSignal('No mention selected')
  return (
    <Card title="Basic @" description="Default prefix is @ and selection only notifies the caller.">
      <MentionsRoot
        value={value()}
        onChange={setValue}
        onSelect={(item) => setSelected('Selected ' + item.value)}
      >
        <MentionsTrigger placeholder="Type @ to mention a teammate" />
        <MentionsContent>
          <UserItems />
        </MentionsContent>
      </MentionsRoot>
      <p class="mt-space-sm text-xs text-muted-foreground">{selected()}</p>
    </Card>
  )
}
