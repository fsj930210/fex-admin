import { MentionsContent } from '@fex-design/react/primitive/mentions/content'
import { MentionsItem } from '@fex-design/react/primitive/mentions/item'
import { MentionsList } from '@fex-design/react/primitive/mentions/list'
import { MentionsRoot } from '@fex-design/react/primitive/mentions/root'
import { MentionsTrigger } from '@fex-design/react/primitive/mentions/trigger'
import { useMentions } from '@fex-design/react/primitive/mentions/use-mentions'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'
import { filterByText, mentionDocs } from './data'

function DocItems() {
  const mentions = useMentions()
  return (
    <MentionsList>
      {filterByText(mentionDocs, mentions.text, (doc) => doc.title).map((doc) => (
        <MentionsItem key={doc.id} itemKey={doc.id} value={doc.title} data={doc}>
          <span className="flex items-center gap-space-sm">
            <span className="font-medium">{doc.title}</span>
            <span className="text-xs text-muted-foreground">{doc.type}</span>
          </span>
        </MentionsItem>
      ))}
    </MentionsList>
  )
}

export function ParamsDemo() {
  const [value, setValue] = useState('')
  const [params, setParams] = useState<string[]>([])
  return (
    <Card title="Parameter-only selection" description="Selection can pass AI params without mutating text.">
      <MentionsRoot
        prefix="#"
        value={value}
        onChange={setValue}
        onSelect={(item) => setParams((current) => [...current, item.value])}
      >
        <MentionsTrigger placeholder="Type # to attach knowledge context" autoSize={{ minRows: 2 }} />
        <MentionsContent>
          <DocItems />
        </MentionsContent>
      </MentionsRoot>
      <div className="mt-space-sm flex flex-wrap gap-space-xs text-xs text-muted-foreground">
        {params.length ? params.map((param) => <span key={param}>#{param}</span>) : 'No params yet'}
      </div>
    </Card>
  )
}
