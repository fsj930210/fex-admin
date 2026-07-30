import { Rate } from '@fex/components-react/primitive/rate'
import { Card } from '@fex/components-react/ui/card'
import { useState } from 'react'

export function FractionDemo() {
  const [value, setValue] = useState(4.3)
  const [previewValue, setPreviewValue] = useState<number | null>(null)

  return (
    <Card title="Arbitrary fractions" description="step controls interaction precision, while read-only values preserve their exact fraction.">
      <div className="grid gap-space-lg">
        <div className="grid gap-space-sm">
          <Rate
            value={value}
            step={0.1}
            onValueChange={setValue}
            onValuePreviewChange={setPreviewValue}
            getValueText={(nextValue, count) => `${nextValue} points out of ${count}`}
            aria-label="Decimal rating"
          />
          <p className="text-sm text-muted-foreground">Interactive value: {(previewValue ?? value).toFixed(1)}</p>
        </div>
        <div className="grid gap-space-sm">
          <Rate value={4.37} readOnly aria-label="Exact read-only rating" />
          <p className="text-sm text-muted-foreground">Read-only value: 4.37</p>
        </div>
      </div>
    </Card>
  )
}
