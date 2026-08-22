import { InputNumber } from '@fex-design/solid/primitive/input-number'
import Card from '@fex-design/solid/ui/card'
export function SuffixDemo() {
  return (
    <Card
      title="Suffix and clear"
      description="Suffix replaces actions while clear remains independent."
    >
      <div class="grid gap-space-md md:grid-cols-3">
        <InputNumber clearable defaultValue={20} />
        <InputNumber defaultValue={20} suffix="kg" />
        <InputNumber clearable defaultValue={20} suffix="%" />
      </div>
    </Card>
  )
}
