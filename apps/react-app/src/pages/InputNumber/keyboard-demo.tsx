import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

export function KeyboardDemo() {
  const [message, setMessage] = useState('Use ArrowUp, ArrowDown or the icon buttons.')
  return (
    <Card
      title="Keyboard and events"
      description="The originating native event stays first and the numeric value is appended."
    >
      <div className="max-w-sm space-y-space-sm">
        <InputNumber
          defaultValue={5}
          clearable
          onChange={(event, value) => setMessage(`${event.type}: ${value ?? 'empty'}`)}
          aria-label="Keyboard number"
        />
        <p className="text-sm text-muted-foreground">{message}</p>
      </div>
    </Card>
  )
}
