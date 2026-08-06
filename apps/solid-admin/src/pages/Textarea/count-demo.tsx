import { TextareaInput, TextareaRoot } from '@fex-design/solid/primitive/textarea'
import { Card } from '@fex-design/solid/ui/card'
import { createSignal } from 'solid-js'

const maxLength = 120

export function CountDemo() {
  const [value, setValue] = createSignal('Textarea count is implemented by the demo, not by the primitive.')

  return (
    <Card title="Count" description="Character count is derived by the caller and rendered wherever needed.">
      <div class="max-w-xl space-y-space-sm">
        <TextareaRoot value={value()} onChange={setValue} autoSize={{ minRows: 3, maxRows: 6 }}>
          <TextareaInput aria-label="Textarea with count" maxLength={maxLength} />
        </TextareaRoot>
        <p class="text-right text-sm text-muted-foreground">
          {value().length} / {maxLength}
        </p>
      </div>
    </Card>
  )
}
