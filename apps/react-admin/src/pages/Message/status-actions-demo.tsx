import { Bubble, BubbleContent } from '@fex-design/react/primitive/bubble'
import { Message, MessageAction, MessageActions, MessageBody, MessageContent, MessageFooter, MessageStatus } from '@fex-design/react/primitive/message'
import { Button } from '@fex-design/react/ui/button'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

export function StatusActionsDemo() {
  const [liked, setLiked] = useState(false)
  return <Card title="Actions" description="Place message-level controls and delivery operations in MessageFooter; business events remain caller-owned.">
    <div className="mx-auto grid w-full max-w-2xl gap-10 py-8">
      <Message><MessageBody><MessageContent><Bubble><BubbleContent>The install failure is coming from the<br />workspace package.</BubbleContent></Bubble></MessageContent><MessageFooter><MessageActions visibility="always"><MessageAction aria-label="Copy response">Copy</MessageAction><MessageAction aria-label="Helpful" pressed={liked} onChange={setLiked}>Like</MessageAction><MessageAction aria-label="Not helpful">Dislike</MessageAction></MessageActions></MessageFooter></MessageBody></Message>
      <Message side="end"><MessageBody><MessageContent><Bubble variant="solid"><BubbleContent>Okay, drop me a link. Taking a look...</BubbleContent></Bubble></MessageContent><MessageFooter><MessageStatus tone="danger">Failed to send</MessageStatus><MessageActions visibility="always"><MessageAction render={({ props }) => <Button {...props} size="xs" variant="ghost">Retry</Button>} /></MessageActions></MessageFooter></MessageBody></Message>
    </div>
  </Card>
}
