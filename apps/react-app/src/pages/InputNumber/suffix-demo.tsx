import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'

export function SuffixDemo() {
  return (
    <Card
      title="Suffix and clear"
      description="A custom suffix replaces the complete default action area while clear remains independent."
    >
      <div className="grid gap-space-md md:grid-cols-3">
        <InputNumber clearable defaultValue={20} aria-label="Clearable number" />
        <InputNumber defaultValue={20} suffix="kg" aria-label="Weight" />
        <InputNumber clearable defaultValue={20} suffix="%" aria-label="Percentage" />
      </div>
    </Card>
  )
}
