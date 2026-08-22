import { MentionsContent } from '@fex-design/solid/primitive/mentions/content'
import { MentionsItem } from '@fex-design/solid/primitive/mentions/item'
import { MentionsList } from '@fex-design/solid/primitive/mentions/list'
import { MentionsPrefixCase } from '@fex-design/solid/primitive/mentions/prefix-case'
import { MentionsRoot, useMentions } from '@fex-design/solid/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/solid/primitive/mentions/trigger'
import { Card } from '@fex-design/solid/ui/card'
import { For, createSignal } from 'solid-js'
import { filterByText, mentionCommands, mentionDocs, mentionUsers } from './data'

function Users() {
  const mentions = useMentions()
  return <MentionsList><For each={filterByText(mentionUsers, mentions.text(), (item) => item.name)}>{(item) => <MentionsItem itemKey={item.id} value={item.name}>@{item.name}</MentionsItem>}</For></MentionsList>
}
function Docs() {
  const mentions = useMentions()
  return <MentionsList><For each={filterByText(mentionDocs, mentions.text(), (item) => item.title)}>{(item) => <MentionsItem itemKey={item.id} value={item.title}>#{item.title}</MentionsItem>}</For></MentionsList>
}
function Commands() {
  const mentions = useMentions()
  return <MentionsList><For each={filterByText(mentionCommands, mentions.text(), (item) => item.label)}>{(item) => <MentionsItem itemKey={item.id} value={item.id}>/{item.label}</MentionsItem>}</For></MentionsList>
}

export function PrefixDemo() {
  const [value, setValue] = createSignal('')
  const [selected, setSelected] = createSignal('Type @, #, or /')
  return (
    <Card title="Trigger characters" description="Each prefix renders a caller-owned list.">
      <MentionsRoot
        prefix={['@', '#', '/']}
        value={value()}
        onChange={setValue}
        onSelect={(item, meta) => setSelected(meta.prefix + ' -> ' + item.value)}
      >
        <MentionsTrigger placeholder="Try @Ada, #Pricing, or /summarize" />
        <MentionsContent>
          <MentionsPrefixCase prefix="@"><Users /></MentionsPrefixCase>
          <MentionsPrefixCase prefix="#"><Docs /></MentionsPrefixCase>
          <MentionsPrefixCase prefix="/"><Commands /></MentionsPrefixCase>
        </MentionsContent>
      </MentionsRoot>
      <p class="mt-space-sm text-xs text-muted-foreground">{selected()}</p>
    </Card>
  )
}
