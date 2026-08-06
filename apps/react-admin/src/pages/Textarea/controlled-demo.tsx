import { TextareaClear, TextareaInput, TextareaRoot } from '@fex-design/react/primitive/textarea'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

export function ControlledDemo() {
  const [value, setValue] = useState('Controlled textarea value')

  return (
    <Card
      title="Controlled and uncontrolled"
      description="Root owns the value protocol; callers can provide value or only defaultValue."
    >
      <div className="grid gap-space-lg md:grid-cols-2">
        <div className="space-y-space-sm">
          <TextareaRoot value={value} onChange={setValue} autoSize={{ minRows: 2, maxRows: 5 }}>
            <TextareaInput aria-label="Controlled textarea" placeholder="Controlled" />
            <TextareaClear aria-label="Clear controlled textarea" />
          </TextareaRoot>
          <p className="text-sm text-muted-foreground">Value: {value || '(empty)'}</p>
        </div>

        <TextareaRoot defaultValue="Uncontrolled textarea value" autoSize={{ minRows: 2, maxRows: 5 }}>
          <TextareaInput aria-label="Uncontrolled textarea" placeholder="Uncontrolled" />
          <TextareaClear aria-label="Clear uncontrolled textarea" />
        </TextareaRoot>
      </div>
    </Card>
  )
}
