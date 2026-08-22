import { TextareaInput, TextareaRoot } from '@fex-design/react/primitive/textarea'
import { Card } from '@fex-design/react/ui/card'

export function BasicDemo() {
  return (
    <Card title="Basic" description="TextareaInput keeps native textarea semantics inside TextareaRoot.">
      <TextareaRoot className="max-w-xl" defaultValue="Review the latest support request.">
        <TextareaInput aria-label="Basic textarea" placeholder="Write a note" />
      </TextareaRoot>
    </Card>
  )
}
