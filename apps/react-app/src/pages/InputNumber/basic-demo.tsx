import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'
import { useState } from 'react'

export function BasicDemo() {
  const [value, setValue] = useState<number | undefined>(8)
  return (
    <Card
      title="Basic"
      description="Controlled and uncontrolled numeric values share the default icon actions."
    >
      <div className="grid gap-space-lg md:grid-cols-2">
        <InputNumber defaultValue={3} aria-label="Uncontrolled number" />
        <div className="space-y-space-sm">
          <InputNumber
            value={value}
            onChange={(_, next) => setValue(next)}
            aria-label="Controlled number"
          />
          <p className="text-sm text-muted-foreground">Value: {value ?? 'empty'}</p>
        </div>
      </div>
    </Card>
  )
}
