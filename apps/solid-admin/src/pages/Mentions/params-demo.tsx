import { MentionsContent } from '@fex-design/solid/primitive/mentions/content'
import { MentionsItem } from '@fex-design/solid/primitive/mentions/item'
import { MentionsList } from '@fex-design/solid/primitive/mentions/list'
import { MentionsRoot, useMentions } from '@fex-design/solid/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/solid/primitive/mentions/trigger'
import { Card } from '@fex-design/solid/ui/card'
import { For, createSignal } from 'solid-js'
import { filterByText, mentionDocs } from './data'

function Docs() {
  const mentions = useMentions()
  return (
    <MentionsList>
      <For each={filterByText(mentionDocs, mentions.text(), (doc) => doc.title)}>
        {(doc) => <MentionsItem itemKey={doc.id} value={doc.title} data={doc}>{doc.title}</MentionsItem>}
      </For>
    </MentionsList>
  )
}

export function ParamsDemo() {
  const [value, setValue] = createSignal('')
  const [params, setParams] = createSignal<string[]>([])
  return (
    <Card title="Parameter-only selection" description="Selection stores params without writing mention text.">
      <MentionsRoot
        prefix="#"
        value={value()}
        onChange={setValue}
        onSelect={(item) => setParams((current) => [...current, item.value])}
      >
        <MentionsTrigger placeholder="Type # to attach knowledge context" />
        <MentionsContent><Docs /></MentionsContent>
      </MentionsRoot>
      <div class="mt-space-sm flex flex-wrap gap-space-xs text-xs text-muted-foreground">
        <For each={params()} fallback="No params yet">{(param) => <span>#{param}</span>}</For>
      </div>
    </Card>
  )
}
