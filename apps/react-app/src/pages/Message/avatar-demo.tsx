import { Avatar, AvatarFallback, AvatarImage } from '@fex-design/react/primitive/avatar'
import { Bubble, BubbleContent } from '@fex-design/react/primitive/bubble'
import { Message, MessageAvatar, MessageBody, MessageContent } from '@fex-design/react/primitive/message'
import { Card } from '@fex-design/react/ui/card'

const AssistantAvatar = () => <Avatar><AvatarImage src="/avatar-demo.svg" alt="Oliver" /><AvatarFallback>O</AvatarFallback></Avatar>
const UserAvatar = () => <Avatar><AvatarFallback>ME</AvatarFallback></Avatar>

export function AvatarDemo() {
  return <Card title="Avatar" description="MessageAvatar reuses the project Avatar and follows the logical message side.">
    <div className="mx-auto grid w-full max-w-2xl gap-5 py-8">
      <Message><MessageAvatar><AssistantAvatar /></MessageAvatar><MessageBody><MessageContent><Bubble><BubbleContent>The build failed during dependency installation.</BubbleContent></Bubble></MessageContent></MessageBody></Message>
      <Message side="end"><MessageAvatar><UserAvatar /></MessageAvatar><MessageBody><MessageContent><Bubble variant="solid"><BubbleContent>Can you share the exact error?</BubbleContent></Bubble></MessageContent></MessageBody></Message>
      <Message><MessageAvatar><AssistantAvatar /></MessageAvatar><MessageBody><MessageContent><Bubble><BubbleContent>Here is the error from the logs.</BubbleContent></Bubble><Bubble><BubbleContent>Something went wrong with the build.<br />The libraries are not installed correctly.<br />Try running the build again.</BubbleContent></Bubble></MessageContent></MessageBody></Message>
    </div>
  </Card>
}
