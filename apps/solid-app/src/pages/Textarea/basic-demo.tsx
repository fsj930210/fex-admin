import { TextareaInput, TextareaRoot } from '@fex-design/solid/primitive/textarea'
import { Card } from '@fex-design/solid/ui/card'

export function BasicDemo() {
  return (
    <Card title="Basic" description="TextareaInput keeps native textarea semantics inside TextareaRoot.">
      <TextareaRoot class="max-w-xl" defaultValue="Review the latest support request.">
        <TextareaInput aria-label="Basic textarea" placeholder="Write a note" />
      </TextareaRoot>
    </Card>
  )
}
