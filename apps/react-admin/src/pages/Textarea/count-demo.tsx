import { TextareaInput, TextareaRoot } from '@fex-design/react/primitive/textarea'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

const maxLength = 120

export function CountDemo() {
  const [value, setValue] = useState('Textarea count is implemented by the demo, not by the primitive.')

  return (
    <Card title="Count" description="Character count is derived by the caller and rendered wherever needed.">
      <div className="max-w-xl space-y-space-sm">
        <TextareaRoot value={value} onChange={setValue} autoSize={{ minRows: 3, maxRows: 6 }}>
          <TextareaInput aria-label="Textarea with count" maxLength={maxLength} />
        </TextareaRoot>
        <p className="text-right text-sm text-muted-foreground">
          {value.length} / {maxLength}
        </p>
      </div>
    </Card>
  )
}
