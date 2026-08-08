import { MentionsContent } from '@fex-design/solid/primitive/mentions/content'
import { MentionsItem } from '@fex-design/solid/primitive/mentions/item'
import { MentionsList } from '@fex-design/solid/primitive/mentions/list'
import { MentionsRoot, useMentions } from '@fex-design/solid/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/solid/primitive/mentions/trigger'
import { Card } from '@fex-design/solid/ui/card'
import { cn } from '@fex/utils'
import { For, createSignal } from 'solid-js'
import { filterByText, mentionUsers } from './data'

function Users() {
  const mentions = useMentions()
  return <MentionsList><For each={filterByText(mentionUsers, mentions.text(), (user) => user.name)}>{(user) => <MentionsItem itemKey={user.id} value={user.name}>{user.name}</MentionsItem>}</For></MentionsList>
}

export function CustomTriggerDemo() {
  const [value, setValue] = createSignal('')
  return (
    <Card title="Custom trigger" description="Render props bind behavior to a custom textarea surface.">
      <MentionsRoot value={value()} onChange={setValue}>
        <MentionsTrigger>
          {({ props, ref, state }) => (
            <textarea
              {...props}
              ref={ref}
              class={cn(
                'min-h-24 w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm outline-none',
                'focus-visible:border-focus focus-visible:ring-3 focus-visible:ring-focus/50',
                state.open() && 'border-focus',
              )}
              placeholder="Custom composer; type @"
            />
          )}
        </MentionsTrigger>
        <MentionsContent><Users /></MentionsContent>
      </MentionsRoot>
    </Card>
  )
}
