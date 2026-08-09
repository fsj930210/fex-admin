import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'

export function ConstraintsDemo() {
  return (
    <Card
      title="Step and precision"
      description="Decimal stepping is rounded to the configured precision."
    >
      <InputNumber
        className="max-w-sm"
        defaultValue={1.5}
        step={0.25}
        precision={2}
        aria-label="Decimal step"
      />
    </Card>
  )
}
