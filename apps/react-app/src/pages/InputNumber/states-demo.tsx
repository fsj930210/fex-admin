import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'

export function StatesDemo() {
  return (
    <Card
      title="States"
      description="InputNumber reuses Input disabled, read-only, invalid and status styling."
    >
      <div className="grid gap-space-md md:grid-cols-2">
        <InputNumber disabled defaultValue={10} aria-label="Disabled number" />
        <InputNumber readOnly defaultValue={10} aria-label="Read only number" />
        <InputNumber invalid defaultValue={10} aria-label="Invalid number" />
        <InputNumber status="warning" defaultValue={10} aria-label="Warning number" />
      </div>
    </Card>
  )
}
