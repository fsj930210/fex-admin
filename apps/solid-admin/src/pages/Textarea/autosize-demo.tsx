import { TextareaInput, TextareaRoot } from '@fex-design/solid/primitive/textarea'
import { Card } from '@fex-design/solid/ui/card'

export function AutosizeDemo() {
  const defaultValue =
    'Line one starts at the minimum height.\nLine two expands the textarea.\nLine three keeps growing.\nLine four reaches the configured maxRows.\nLine five now scrolls inside.'

  return (
    <Card
      title="Autosize"
      description="autoSize={{ minRows: 1, maxRows: 4 }}: content grows the field up to 4 rows, then the textarea scrolls."
    >
      <TextareaRoot
        autoSize={{ minRows: 1, maxRows: 4 }}
        class="max-w-xl"
        defaultValue={defaultValue}
      >
        <TextareaInput
          aria-label="Autosize textarea"
          placeholder="Type multiple lines to grow the input"
        />
      </TextareaRoot>
    </Card>
  )
}
