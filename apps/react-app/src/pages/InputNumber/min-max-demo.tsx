import { InputNumber } from '@fex-design/react/primitive/input-number'
import { Card } from '@fex-design/react/ui/card'

export function MinMaxDemo() {
  return (
    <Card
      title="Min and max"
      description="Actions are disabled when the value reaches its boundary."
    >
      <div className="grid gap-space-lg md:grid-cols-2">
        <label className="grid gap-space-sm text-sm text-foreground">
          Minimum: 0
          <InputNumber defaultValue={0} min={0} max={10} aria-label="Value at minimum" />
        </label>
        <label className="grid gap-space-sm text-sm text-foreground">
          Maximum: 10
          <InputNumber defaultValue={10} min={0} max={10} aria-label="Value at maximum" />
        </label>
      </div>
    </Card>
  )
}
