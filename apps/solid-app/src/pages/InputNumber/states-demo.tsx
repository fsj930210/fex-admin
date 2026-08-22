import { InputNumber } from '@fex-design/solid/primitive/input-number'
import Card from '@fex-design/solid/ui/card'
export function StatesDemo() {
  return (
    <Card title="States" description="Input state styling is reused.">
      <div class="grid gap-space-md md:grid-cols-2">
        <InputNumber disabled defaultValue={10} />
        <InputNumber readOnly defaultValue={10} />
        <InputNumber invalid defaultValue={10} />
        <InputNumber status="warning" defaultValue={10} />
      </div>
    </Card>
  )
}
