import { MentionsContent } from '@fex-design/react/primitive/mentions/content'
import { MentionsItem } from '@fex-design/react/primitive/mentions/item'
import { MentionsList } from '@fex-design/react/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/react/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/react/primitive/mentions/trigger'
import { useMentions } from '@fex-design/react/primitive/mentions/use-mentions'
import { Card } from '@fex-design/react/ui/card'
import { cn } from '@fex/utils'
import { useState } from 'react'
import { filterByText, mentionUsers } from './data'

function UserItems() {
  const mentions = useMentions()
  return (
    <MentionsList>
      {filterByText(mentionUsers, mentions.text, (user) => user.name).map((user) => (
        <MentionsItem key={user.id} itemKey={user.id} value={user.name} data={user}>
          {user.name}
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

export function CustomTriggerDemo() {
  const [value, setValue] = useState('')
  return (
    <Card title="Custom trigger" description="Render props bind mention behavior to a custom textarea.">
      <MentionsRoot value={value} onChange={setValue}>
        <MentionsTrigger>
          {({ props, ref, state }) => (
            <textarea
              {...props}
              ref={ref}
              className={cn(
                'min-h-24 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none',
                'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
                state.open && 'border-focus',
              )}
              placeholder="Custom composer; type @"
            />
          )}
        </MentionsTrigger>
        <MentionsContent>
          <UserItems />
        </MentionsContent>
      </MentionsRoot>
    </Card>
  )
}
