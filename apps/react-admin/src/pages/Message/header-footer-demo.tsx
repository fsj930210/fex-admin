import { Bubble, BubbleContent } from '@fex-design/react/primitive/bubble'
import { Message, MessageBody, MessageContent, MessageFooter, MessageHeader } from '@fex-design/react/primitive/message'
import { Card } from '@fex-design/react/ui/card'

export function HeaderFooterDemo() {
  return <Card title="Header and footer" description="MessageHeader owns sender metadata; MessageFooter owns delivery, read state, and other secondary metadata.">
    <div className="mx-auto grid w-full max-w-2xl gap-8 py-8">
      <Message><MessageBody><MessageHeader>Olivia</MessageHeader><MessageContent><Bubble><BubbleContent>I already checked the logs.</BubbleContent></Bubble></MessageContent></MessageBody></Message>
      <Message side="end"><MessageBody><MessageContent><Bubble variant="solid"><BubbleContent>Send the report to the team. Ping @shadcn<br />if you need help.</BubbleContent></Bubble></MessageContent><MessageFooter>Read Yesterday</MessageFooter></MessageBody></Message>
    </div>
  </Card>
}
